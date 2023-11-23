const RENDER_BOOK = 'render-book'
const books = []

//for storage web
const SAVED_EVENT = 'saved-book'
const STORAGE_KEY = 'BOOK_APPS'

document.addEventListener(SAVED_EVENT, function () {
    const data = sessionStorage.getItem('msg')
    alert(data)
})

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form')

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook()
    })

    if (isStorageExist()) {
        loadDataFromStorage()
    }
})

function addBook() {
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const year = parseInt(document.getElementById('year').value)

    const generateID = generateId()
    const bookObject = generateBookObejct(generateID, title, author, year, false)

    books.push(bookObject)
    document.dispatchEvent(new Event(RENDER_BOOK))
    setAlertMessage('berhasil menambahkan data buku')
    saveData()
}

function generateId() {
    return +new Date()
}

function generateBookObejct(id, title, author, year, isComplete) {
    return {
        id, title, author, year, isComplete
    }
}

document.addEventListener(RENDER_BOOK, function () {
    const unRead = document.getElementById('book-unread-list')
    unRead.innerHTML = ''

    const readBook = document.getElementById('book-read-list')
    readBook.innerHTML = ''

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem)
        if (!bookItem.isComplete) {
            unRead.append(bookElement)
        } else {
            readBook.append(bookElement)
        }
    }
})

function makeBook(bookObject) {
    const bookTitle = document.createElement('p')
    bookTitle.innerText = "Title:\t" + bookObject.title

    const textAuthor = document.createElement('p')
    textAuthor.innerText = "Author:\t" + bookObject.author

    const textYear = document.createElement('p')
    textYear.innerText = "Year:\t" + bookObject.year

    const containerSection = document.createElement('section')
    containerSection.append(bookTitle, textAuthor, textYear)

    const containerCard = document.createElement('div')
    containerCard.classList.add('card')
    containerCard.append(containerSection)

    containerCard.setAttribute('id', `book-${bookObject.id}`)

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button')
        undoButton.classList.add('redo-button')

        undoButton.addEventListener('click', function () {
            undoBookFromRead(bookObject.id)
        })

        const hapusButton = document.createElement('button')
        hapusButton.classList.add('hapus-button')

        hapusButton.addEventListener('click', function () {

            removeBookFromRead(bookObject.id)
        })

        const containerSection2 = document.createElement('section')
        containerSection2.append(undoButton, hapusButton)
        containerCard.append(containerSection2)

    } else {
        const checkButton = document.createElement('button')
        checkButton.classList.add('check-button')

        checkButton.addEventListener('click', function () {
            addBookToRead(bookObject.id)
        })

        const hapusButton = document.createElement('button')
        hapusButton.classList.add('hapus-button')

        hapusButton.addEventListener('click', function () {

            removeBookFromRead(bookObject.id)
        })


        const containerSection3 = document.createElement('section')
        containerSection3.append(checkButton, hapusButton)
        containerCard.append(containerSection3)
    }

    return containerCard
}

function addBookToRead(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return

    bookTarget.isComplete = true
    document.dispatchEvent(new Event(RENDER_BOOK))
    setAlertMessage('Buku selesei dibaca')
    saveData()
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }

    return null
}

function removeBookFromRead(bookId) {
    const bookTarget = findBookIndex(bookId)

    if (bookTarget == -1) return


    if (confirm('yakin ingin menghapus buku?') == true) {
        books.splice(bookTarget, 1)
        document.dispatchEvent(new Event(RENDER_BOOK))
        setAlertMessage('berhasil menghapus buku')
        saveData()
    }

}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }
    return -1
}

function undoBookFromRead(bookId) {
    const bookTarget = findBook(bookId)

    if (bookTarget == null) return

    bookTarget.isComplete = false
    document.dispatchEvent(new Event(RENDER_BOOK))
    setAlertMessage('Buku dipindahkan ke Belum dibaca')
    saveData()
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser yang anda gunakan tidak mendukung fitur web storage')
        return false
    }

    return true
}

function loadDataFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY)
    let dataParse = JSON.parse(data)

    if (dataParse !== null) {
        for (const book of dataParse) {
            books.push(book)
        }
    }

    document.dispatchEvent(new Event(RENDER_BOOK))
}

function setAlertMessage(msg) {
    sessionStorage.setItem('msg', msg)
}