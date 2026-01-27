const API_URL = process.env.WORDPRESS_API_URL;

if (!API_URL) {
  throw new Error('WORDPRESS_API_URL environment variable is not set.');
}

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
    next: { revalidate: 60 },
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

// Pagination enabled: accepts cursor (after)
export async function getAllPosts(after = null) {
  const data = await fetchAPI(
    `
    query AllPosts($after: String) {
      posts(first: 12, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
        pageInfo {
          hasNextPage
          endCursor
        }
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
  `,
    {
      variables: { after }
    }
  );
  if (!data || !data.posts) {
    throw new Error('Failed to fetch posts: API response is invalid.');
  }
  return data?.posts; // Return entire object for pageInfo
}

export async function getSearchResults(term) {
  const data = await fetchAPI(
    `
    query SearchPosts($term: String!) {
      posts(first: 20, where: { search: $term }) {
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
        }
      }
    }
  `,
    {
      variables: { term }
    }
  );
  return data?.posts?.nodes || [];
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
              description
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

  if (!data || !data.menus) {
    throw new Error('Failed to fetch menus: API response is invalid.');
  }

  const menus = data?.menus?.nodes || [];

  const headerMenu = menus.find(m =>
    m.slug === 'main' ||
    m.slug === 'primary' ||
    m.slug === 'header' ||
    (m.name && m.name.toLowerCase().includes('main')) ||
    (m.name && m.name.toLowerCase().includes('header'))
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

  let newContent = content;

  // Replacements for .com (links only)
  newContent = newContent.replace(/href="https:\/\/blog\.ratex\.com([^"]*)"/g, 'href="$1"');
  newContent = newContent.replace(/href='https:\/\/blog\.ratex\.com([^']*)'/g, "href='$1'");

  // Replacements for .co (links only)
  newContent = newContent.replace(/href="https:\/\/blog\.ratex\.co([^"]*)"/g, 'href="$1"');
  newContent = newContent.replace(/href='https:\/\/blog\.ratex\.co([^']*)'/g, "href='$1'");

  // Also clean up any http links if present
  newContent = newContent.replace(/href="http:\/\/blog\.ratex\.co([^"]*)"/g, 'href="$1"');

  return newContent;
}

export async function getPostsByCategory(slug) {
  const data = await fetchAPI(
    `
    query PostsByCategory($slug: ID!) {
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
