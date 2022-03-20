const express = require('express');
// const { render } = require('express/lib/response');
const db = require('../data/databook')
const router = express.Router();

router.get('/', (req, res) => {
	res.render('books')
})
// router.get('/All-book',(req,res)=>{
// 	res.render('all-book')
// })
router.get('/Create-book', async (req, res) => {
	const [authors] = await db.query("SELECT * FROM AUTHORS");
	res.render('create-book', { authors: authors })
})
router.get('/All-book', async (req, res) => {
	const query = `SELECT BOOKS.*, AUTHORS.NAME AS AUTHORS_NAME
	 FROM BOOKS INNER JOIN AUTHORS ON AUTHORS.Id = BOOKS.AUTHORS_ID `;
	const [books] = await db.query(query);
	res.render('all-book', { books: books });

})
router.get('/All-book/:id', async (req, res) => {
	const query = `SELECT BOOKS.*, AUTHORS.NAME AS AUTHORS_NAME, AUTHORS.EMAIL AS
	AUTHORS_EMAIL
	 FROM BOOKS INNER JOIN AUTHORS ON AUTHORS.Id = BOOKS.AUTHORS_ID
	 WHERE BOOKS.ID=? `;
	const [books] = await db.query(query, [req.params.id]);
	if (!books || books.length === 0) {
		return res.status(404).render('404')
	}
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
	const postData = {
		...books[0],
		data: books[0].date = new Date(),
		humanReadableDate: books[0].date.toLocaleDateString('en-US', options)
	};
	res.render('book-detail', { book: postData })


})
router.get('/All-book/:id/edit', async (req, res) => {
	const query = `SELECT * from books
	 WHERE BOOKS.ID=? `;
	const query2 = `SELECT * from authors`
	const [books] = await db.query(query, [req.params.id]);
	const [authors] = await db.query(query2)
	if (!books || books.length === 0) {
		return res.status(404).render('404')
	}

	res.render('update-book', { book: books[0], authors: authors })


})
router.post('/books', async (req, res) => {
	const data = [

		req.body.title,
		req.body.summary,
		req.body.content,
		req.body.datetime,
		req.body.author
	]
	await db.query("insert into books(name,summary,body,date,authors_id) values(?)", [
		data,
	]);
	res.redirect('/')

})
router.post('/All-book/:id/edit', async (req, res) => {
	const query = `UPDATE books SET name = ?, summary=?, body=?,date=?, authors_id=? where id=? `
	await db.query(query, [
		req.body.title,
		req.body.summary,
		req.body.content,
		req.body.datetime,
		req.body.author,
		req.params.id
	]);
	res.redirect('/')

})
router.post('/All-book/:id/delete',async (req,res)=>{
	const query = `delete from books where id=?`;
await db.query(query,[req.params.id]);
res.redirect('/All-book')
})
module.exports = router