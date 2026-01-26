// Native fetch is available in Node.js 18+

async function debugCategories() {
    const query = `
    query GetCategories {
      categories {
        nodes {
          name
          slug
          id
          uri
        }
      }
    }
  `;

    try {
        const res = await fetch('https://blog.ratex.co/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        const json = await res.json();
        console.log(JSON.stringify(json, null, 2));
    } catch (error) {
        console.error(error);
    }
}

debugCategories();
