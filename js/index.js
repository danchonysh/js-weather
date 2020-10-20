'use strict'

const settings = document.querySelector('#settings')
const forecast = document.querySelector('.forecast')
const main = document.querySelector('main') 

let isAdmin = false

let result

const getHour = num => {
	return num < 10 ? `0${num}:00` : `${num}:00` 
}

const formatText = text => text.trim().toLowerCase()

const toLocale = info => localStorage.setItem('data', JSON.stringify(info))

let data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : []

const getCitiesList = data => {
	const list = document.createElement('ul')
	list.classList.add('cities-list')
	data.forEach(el => {
		const listItem = document.createElement('li')
		listItem.insertAdjacentHTML('afterbegin', `
			<input type="radio" name="city" value="${el.city}"${el.city === result ? ' checked="true"' : ''}>
			<span>${el.city}</span>
		`)
		listItem.classList.add('cities-list__item')
		list.appendChild(listItem)
	})
	return list.outerHTML
}

const getData = info => {
	if (main.hasChildNodes()) main.innerHTML = ''
	const article = document.createElement('article')
	article.classList.add('info')
	const ul = document.createElement('ul')
	ul.className = 'info-list'
	article.appendChild(ul)
	if (info) {
		result = info.city

		for (let i = 0; i < 24; i++) {
			ul.insertAdjacentHTML('beforeend', `
				
				<ul class="info-list__item">
					<li>
						<h3>${getHour(i)}</h3>
						<img class="info__image" src="./images/weather-types/${info.weather[i]}.jpg" alt="${info.weather[i]}" title="${info.weather[i]}"> 
					</li>
					<li>
						<span>Температура</span>
						<span>${info.temp[i]}&#8451; / ${info.feels[i]}&#8451;</span>
					</li>
					<li>
						<span>Влажность</span>
						<span>${info.humidity[i]}%</span>
					</li>
					<li>
						<span>Давление</span>
						<span>${info.pressure[i]}мм</span>
					</li>
					<li>
						<span>Ветер</span>
						<span>${info.wind[i]}м/с</span>
					</li>
				</ul>
			`) 
		}

		article.insertAdjacentHTML('afterbegin', `
			<div class="info__header">
				<h2 class="info__title">${info.city}</h2>
				<p class="info__date">Last update: ${info.date}</p>
			</div>
		`)
		localStorage.setItem('selected', info.city)
	} else {
		article.insertAdjacentHTML('afterbegin', `
			<h2>No information =(</h2>
		`)
	}
		
	main.insertAdjacentHTML('afterbegin', article.outerHTML)
}

localStorage.getItem('selected') ? getData(data.filter(el => el.city === localStorage.getItem('selected'))[0]) : null

settings.addEventListener('click', () => {
	const setWindow = Lib.modal({
		title: 'Cities',
		content: `
			<p class="cities-text">Please, choose city:<img src="./images/settings.png" class="edit-button" alt="edit" title="edit"></p>
			<input class="cities-search" placeholder="Search" type="text">
			${getCitiesList(data)}
		`,
		footerButtons: [
			{
				text: 'OK',
				type: 'ok',
				handler() {
					setWindow.close()
					setWindow.destroy()
				}
			}
		],
		closable: true,
	})

	const setSettings = (list, login) => {
		list.classList.add('edit-list')
		const addBtn = document.createElement('button')
		addBtn.className = 'add-button'
		addBtn.textContent = 'Add'
		list.parentNode.insertBefore(addBtn, list)
		addBtn.addEventListener('click', () => {
			const addCity = Lib.modal({
				closable: true,
				width: 'min(50%, 250px)',
				title: 'Add city',
				content: `
					<input class="confirm" type="text" placeholder="City" autofocus>
				`,
				footerButtons: [
					{text: 'Add', type: 'ok', handler(e) {
						const ctx = e.target.parentNode.parentNode
						const input = ctx.querySelector('.confirm')
						if (input.value.trim()) {
							getEditField(input.value.trim())
							addCity.close()
							addCity.destroy()
							setWindow.close()
							setWindow.destroy()
						} else {
							input.style.borderColor = 'red'
						}
					}}	
				]
			})
			addCity.open()
		})
		list.childNodes.forEach(el => {
			el.removeChild(el.firstElementChild)
			el.insertAdjacentHTML('beforeend', `
				<div class="buttons">
					<button class="buttons__edit">Edit</button>
					<button  class="buttons__remove">Remove</button>
				</div>
			`)
			el.querySelector('.buttons__edit').addEventListener('click', e => {
				getEditField(e.target.parentNode.parentNode.firstElementChild.textContent)
				setWindow.close()
				setWindow.destroy()
			})
			el.querySelector('.buttons__remove').addEventListener('click', e => {
				list.removeChild(e.target.parentNode.parentNode)
				data = data.filter(el => el.city !== e.target.parentNode.parentNode.firstElementChild.textContent)
				toLocale(data)
				if (e.target.parentNode.parentNode.firstElementChild.textContent === result) getData(data[0]) 
			})
		})
		if (login) {
			login.close()
			login.destroy()
		}						
	}

	document.querySelector('.edit-button').addEventListener('click', e => {
		const btn = e.target 
		const list = btn.parentNode.nextElementSibling.nextElementSibling 
		if (!isAdmin) {
			const login = Lib.modal({
				closable: true,
				width: 'min(50%, 250px)',
				title: 'Authorization',
				content: `
					<input class="confirm" type="password" placeholder="Password" autofocus>
				`,
				footerButtons: [
					{text: 'Confirm', type: 'ok', handler(e) {
						const input = e.target.parentNode.previousElementSibling.firstElementChild
						if (input.value === 'admin') {
							isAdmin = true
							setSettings(list, login)
							btn.parentNode.removeChild(btn)
						} else {
							input.style.borderColor = 'red'
						}	
					}}
				]
			})
			login.open()
		} else {
			btn.parentNode.removeChild(btn)
			setSettings(list)
		}
		
	})

	const citiesSearch = document.querySelector('.cities-search')

	citiesSearch.addEventListener('input', () => {
		if (!citiesSearch.value.trim()) {
			document.querySelector('.cities-list').childNodes.forEach(el => el.style.display = 'flex')
		} else {
			document.querySelector('.cities-list').childNodes.forEach(el => {
				if (!formatText(el.textContent).includes(formatText(citiesSearch.value))) {
					el.style.display = 'none'
				}
			})
		}
	})

	setWindow.open()
})

document.body.addEventListener('click', (e) => {
	if (e.target.getAttribute('name') === 'city') {
		result = e.target.value
		data.filter(el => el.city === e.target.value).forEach(el =>
			getData(el)
		)
	}
})

const getNewInfo = amount => {
	const ul = document.createElement('ul')
	ul.classList.add('new-info-list')
	for (let i = 0; i < amount; i++) {
		ul.insertAdjacentHTML('beforeend', `
			<li class="new-info-list__item">
				<h2>${i}</h2>
				<input min="-80" max="80" class="new-temp" type="number" placeholder="Температура 0&#8451;">
				<input min="-80" max="80" class="new-feels" type="number" placeholder="Ощущается как 0&#8451;">
				<input min="600" max="900" class="new-pressure" type="number" placeholder="Давление 745мм рт.ст.">
				<input min="0" max="100"class="new-humidity" type="number" placeholder="Влажность 80%">
				<input min="0" max="150"class="new-wind" type="number" placeholder="Скорость ветра 3м/с">
				<select class="new-weather">
					<option>Ясно</option>
					<option>Облачно</option>
					<option>Облачно с прояснениями</option>
					<option>Облачно с ветром</option>
					<option>Дождь</option>
					<option>Дождь с грозой</option>
					<option>Ливень</option>
					<option>Ливень с грозой</option>
					<option>Снег</option>
					<option>Ясно со снегом</option>
					<option>Ураган</option>
				</select>	
 			</li>
		`)
	}
	return ul
}

const showForm = () => {
	const form = document.createElement('form')
	form.classList.add('new-info')
	form.insertAdjacentHTML('afterbegin', `
		${getNewInfo(24).outerHTML}
		<input class="add-new-info" type="submit" value="add">
	`)
	if (main.hasChildNodes()) main.removeChild(main.firstChild)
	main.appendChild(form)
}

const hideForm = () => {
	document.querySelector('footer').previousElementSibling.outerHTML = ''
}

const getEditField = city => {
	main.firstElementChild 
		? main.removeChild(main.firstElementChild) 
		: null
	main.insertAdjacentHTML('afterbegin', `
		<h2>${city}</h2>
	`)

	showForm()

	const getValues = prop => {
		const data = []

		document.querySelectorAll('.new-info-list__item').forEach(el => {
			data.push(el.querySelector(`.new-${prop}`).value)
		})

		return data
	}
	document.querySelector('.add-new-info').addEventListener('click', () => {
		data = data.filter(el => el.city !== city)
		data.push({
			city,
			temp: getValues('temp'),
			pressure: getValues('pressure'),
			wind: getValues('wind'),
			weather: getValues('weather'),
			feels: getValues('feels'),
			humidity: getValues('humidity'),
			date: new Date(Date.now()).toLocaleString()
		})
		getData(data[data.length - 1])
		toLocale(data)
	})
}
