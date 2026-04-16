async function test() {
  const res = await fetch('https://api.deezer.com/genre');
  const data = await res.json();
  console.log('GENRES:', JSON.stringify(data.data.slice(0, 10).map(g => ({ name: g.name, picture: g.picture_medium })), null, 2));
  
  const res2 = await fetch('https://api.deezer.com/editorial');
  const data2 = await res2.json();
  console.log('EDITORIAL:', JSON.stringify(data2.data.slice(0, 10).map(e => ({ name: e.name, picture: e.picture_medium })), null, 2));
}

test();
