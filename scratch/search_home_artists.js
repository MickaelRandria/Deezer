async function search() {
  const names = ['JRK 19', 'Green Montana', 'RK', 'Zamdane', 'L2B', "Rim'K", 'Kanye West'];
  const results = {};
  for (const name of names) {
    const res = await fetch(`https://api.deezer.com/search/artist?q=${name}&limit=1`);
    const data = await res.json();
    if (data.data?.[0]) {
      results[name] = { id: data.data[0].id, name: data.data[0].name };
    }
  }
  console.log(JSON.stringify(results, null, 2));
}
search();
