// Native fetch is available in Node.js 18+

async function debugCategoryPosts(slug) {
    const query = `
    query PostsByCategory($slug: String!) {
      category(id: $slug, idType: SLUG) {
        name
        slug
        posts(first: 5) {
          nodes {
            title
            slug
          }
        }
      }
    }
  `;

    try {
        const res = await fetch('https://blog.ratex.co/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { slug }
            }),
        });

        const json = await res.json();
        console.log(`DEBUG for slug "${slug}":`);
        console.log(JSON.stringify(json, null, 2));
    } catch (error) {
        console.error(error);
    }
}

debugCategoryPosts('business');
debugCategoryPosts('finance');
