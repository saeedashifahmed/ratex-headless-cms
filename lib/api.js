const API_URL = process.env.WORDPRESS_API_URL;

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      'Authorization'
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export async function getAllPosts() {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          slug
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
           author {
            node {
              name
              avatar {
                url
              }
            }
          }
        }
      }
    }
  `
  );
  return data?.posts?.nodes;
}

export async function getPostBySlug(slug) {
  const data = await fetchAPI(
    `
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        title
        slug
        date
        content
        featuredImage {
          node {
            sourceUrl
          }
        }
         author {
            node {
              name
              avatar {
                url
              }
            }
          }
      }
    }
  `,
    {
      variables: {
        id: slug,
        idType: 'SLUG',
      },
    }
  );
  return data?.post;
}

export async function getMenus() {
  const data = await fetchAPI(
    `
    query GetMenus {
      menus {
        nodes {
          name
          slug
          menuItems {
            nodes {
              url
              label
              uri
              parentId
            }
          }
        }
      }
    }
  `
  );

  const menus = data?.menus?.nodes || [];

  // Try to find the menus by searching for common names/slugs
  const headerMenu = menus.find(m =>
    m.slug === 'main' ||
    m.slug === 'primary' ||
    m.slug === 'header' ||
    m.name.toLowerCase().includes('main') ||
    m.name.toLowerCase().includes('header')
  );

  const footerMenu = menus.find(m =>
    m.slug === 'footer' ||
    m.name.toLowerCase().includes('footer')
  );

  return {
    header: headerMenu?.menuItems?.nodes || [],
    footer: footerMenu?.menuItems?.nodes || []
  };
}

export function replaceUrls(content) {
  if (!content) return content;

  // 1. Define the backend domain(s) to replace
  // We want to replace 'https://blog.ratex.com' and 'https://blog.ratex.co' with '' (relative)
  // BUT only for <a> tags (links). 
  // For <img> tags, we must KEEP the absolute URL so they load from the remote server.

  // A simple regex approach:
  // We'll treat the content as a string.
  // We want to replace `href="https://blog.ratex.com..."` with `href="/..."`
  // All other occurances (like src="...") should remain.

  let newContent = content;

  // Replacements for .com
  newContent = newContent.replace(/href="https:\/\/blog\.ratex\.com([^"]*)"/g, 'href="$1"');
  newContent = newContent.replace(/href='https:\/\/blog\.ratex\.com([^']*)'/g, "href='$1'");

  // Replacements for .co (just in case)
  newContent = newContent.replace(/href="https:\/\/blog\.ratex\.co([^"]*)"/g, 'href="$1"');
  newContent = newContent.replace(/href='https:\/\/blog\.ratex\.co([^']*)'/g, "href='$1'");

  return newContent;
}

export async function getPostsByCategory(slug) {
  const data = await fetchAPI(
    `
    query PostsByCategory($slug: String!) {
      category(id: $slug, idType: SLUG) {
        name
        posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        slug: slug,
      },
    }
  );
  return data?.category;
}
