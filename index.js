document.addEventListener('DOMContentLoaded', function (event) {
  setTime()
  setDate()
  setStyle()
  setRecentLinks()
  setInterval(setTime, 15000)

  const button = document.querySelector('.content-input > button')

  button.addEventListener('click', search)
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) search()
  })

  function setTime() {
    const now = new Date()
    const utcTime = now.toISOString().replace('T', ' ').replace('.', ' ').substr(11, 5) + ' UTC'

    document.getElementById('current-time').innerHTML = now.toTimeString().substr(0, 5)
    document.getElementById('utc-time').innerHTML = utcTime
  }

  function setDate() {
    const now = new Date()
    document.getElementById('date').innerHTML = now.toDateString().substr(4)
  }

  function createLinkEntry(link, count) {
    const d = document.createElement('span')
    const a = document.createElement('a')
    const c = document.createElement('span')
    const li = document.createElement('li')
    d.classList.add("delete")
    d.innerHTML = "- "
    d.title = "remove"
    d.onclick = function () { removeLink(link) }

    a.onclick = function () { addLink(link) }
    a.href = a.innerHTML = link

    c.innerHTML =  " (" + count + ")";

    li.id = link.replace("https://", "")
    li.appendChild(d)
    li.appendChild(a)
    li.appendChild(c)
    return li
  }

  function addLink(link) {
    let links = JSON.parse(window.localStorage.getItem('links'))
    if (links === null) {
      links = {};
    }
    if (link in links) {
      links[link]++
    } else {
      links[link] = 1
    }
    links = sortLinks(links)
    window.localStorage.setItem('links', JSON.stringify(links))
    location.href = link
  }

  function removeLink(link) {
    let links = JSON.parse(window.localStorage.getItem('links'))
    if (links === null) {
      links = {}
    }
    if (link in links) {
      delete (links[link])
    }
    window.localStorage.setItem('links', JSON.stringify(links))
    const recents = document.querySelector('.recents')

    for (let i = recents.children.length - 1; i > 0; i--) {
      if (recents.children[i].id == link.replace("https://", "")) {
        recents.children[i].remove()
      }
    }
  }

  function sortLinks(links) {
    let r = {}
    Object.entries(links).sort((x, y) => x[1] < y[1]).forEach(element => {
      r[element[0]] = element[1];
    })
    return r
  }

  function search() {
    const str = document.getElementById('search').value
    if (str.substr(0, 8) == "https://") {
      addLink(str)
    } else {
      const output = 'https://duckduckgo.com/?q=' + str
      location.href = output
    }
  }

  function setRecentLinks() {
    const recents = document.querySelector('.recents')
    const links = JSON.parse(window.localStorage.getItem('links'))
    if (links !== null && Object.keys(links).length > 0) {
      const title = document.createElement('li')
      title.innerHTML = 'recents'
      recents.appendChild(title)
      Object.keys(links).slice(0, 10).forEach((link) => {
        recents.appendChild(createLinkEntry(link, links[link]))
      });
    }
  }

  function setStyle() {
    const now = new Date()
    const h = now.getHours()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const w = now.getDay()
    const day = days[w]

    const greetings = document.querySelector('.content-greeting > h1')

    let period

    if (h >= 5 && h < 12) period = 1
    else if (h >= 12 && h < 18) period = 2
    else if (h >= 18) period = 3
    else period = 0

    if (period === 1) {
      greetings.innerHTML = 'Good morning. It\'s ' + day + '.'
      document.querySelector(':root').style.setProperty('--background', '#DCEDFF')
      document.querySelector(':root').style.setProperty('--input', '#fff')
      document.querySelector(':root').style.setProperty('--link', '#4A5E6D')
      document.querySelector(':root').style.setProperty('--shadow', '#232C33')
      document.querySelector(':root').style.setProperty('--color', '#232C33')
    }
    if (period === 2) {
      greetings.innerHTML = 'Good afternoon. It\'s ' + day + '.'
      document.querySelector(':root').style.setProperty('--background', '#97C3B6')
      document.querySelector(':root').style.setProperty('--input', '#F9E7E7')
      document.querySelector(':root').style.setProperty('--color', '#0A2E36')
      document.querySelector(':root').style.setProperty('--shadow', '#0A2E36')
    }
    if (period === 3) {
      greetings.innerHTML = 'Good evening. It\'s still ' + day + '.'
      document.querySelector(':root').style.setProperty('--background', '#161212')
      document.querySelector(':root').style.setProperty('--input', '#7B6565')
      document.querySelector(':root').style.setProperty('--color', '#F9E7E7')
      document.querySelector(':root').style.setProperty('--link', '#7B6565')
      document.querySelector(':root').style.setProperty('--hover', '#F9E7E7')
      document.querySelector(':root').style.setProperty('--shadow', '#000')
    }
    if (period === 0) {
      greetings.innerHTML = 'It\'s ' + day + ' already. Go get some sleep!'
      document.querySelector(':root').style.setProperty('--background', '#0C0606')
      document.querySelector(':root').style.setProperty('--input', '#755')
      document.querySelector(':root').style.setProperty('--color', '#EDD')
      document.querySelector(':root').style.setProperty('--link', '#755')
      document.querySelector(':root').style.setProperty('--hover', '#EDD')
      document.querySelector(':root').style.setProperty('--shadow', '#000')
    }
  }
})
