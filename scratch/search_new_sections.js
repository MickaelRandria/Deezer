async function search() {
  const names = ['KLN', 'Werenoi', 'Bouss', 'SDM', 'menace Santana', 'Lacrim', 'Hornet La Frappe'];
  const results = {};
  for (const name of names) {
    const res = await fetch(`https://api.deezer.com/search/artist?q=${name}&limit=1`);
    const data = await res.json();
    if (data.data?.[0]) {
      results[name] = { id: data.data[0].id, name: data.data[0].name, picture: data.data[0].picture_medium };
    }
  }
  console.log(JSON.stringify(results, null, 2));
}
search();
