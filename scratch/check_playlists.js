async function test() {
  const queries = ['Podcasts', 'Blind Test', 'Concerts', 'Radios'];
  for (const q of queries) {
    const res = await fetch(`https://api.deezer.com/search/playlist?q=${q}&limit=5`);
    const data = await res.json();
    console.log(`QUERY: ${q}`);
    console.log(JSON.stringify(data.data.map(p => ({ title: p.title, picture: p.picture_medium })), null, 2));
  }
}

test();
