(()=> {

	const SHOW_FORM_BTN = document.getElementById('show_input');
	const POSTS = document.getElementById('posts');

	class PostItem {
		constructor(input) {
			this.POST = document.createElement('div');
			this.IMG = document.createElement('div');
			this.MESSAGE = document.createElement('p');
			this.TIME_STAMP = document.createElement('p');
			this.LIKES = document.createElement('div');
			this.READER = new FileReader();
			this.TEXT = input.text;
			this.DATE = input.date;
			this.FILE = input.file;
		}

		init() {
			this.READER.readAsDataURL(this.FILE);

			return this.setImage();
		}

		setImage() {
			this.IMG.classList.add('post__img');
			//get base64 image and put it on a background
			this.READER.onload = (e) => this.IMG.style.background = `url(${e.target.result}) no-repeat center center / cover`;
			this.POST.appendChild(this.IMG);

			return this.setLikes();
		}

		setLikes() {
			this.LIKES.classList.add('post__likes');
			const LIKE_BTN = document.createElement('button'),
				LIKE_ICON = document.createElement('i');
			LIKE_ICON.classList.add('fa-solid', 'fa-heart')
			LIKE_BTN.appendChild(LIKE_ICON);
			LIKE_BTN.addEventListener('click', () => {
				return LIKE_BTN.classList.contains('liked') ? LIKE_BTN.classList.remove('liked') : LIKE_BTN.classList.add('liked');
			});

			this.LIKES.appendChild(LIKE_BTN);
			this.IMG.appendChild(this.LIKES);

			return this.setMessage();
		}

		setMessage() {
			this.MESSAGE.classList.add('post__message');
			this.MESSAGE.innerText = `${this.TEXT}`;
			this.IMG.after(this.MESSAGE);

			return this.setTime();
		}

		setTime() {
			this.TIME_STAMP.classList.add('post__time');
			this.TIME_STAMP.innerText = `${this.DATE.toLocaleString('default', {month: 'long'})} ${this.DATE.getDay()}, ${this.DATE.getFullYear()}`;
			this.MESSAGE.after(this.TIME_STAMP);

			return this.render();
		}

		render() {
			this.POST.classList.add('post');
			POSTS.prepend(this.POST);

			FORM.reset();

			return FORM.hide();
		}
	}

	class Form {
		constructor() {
			this.FORM_EL = document.getElementById('form');
			this.INPUT_FILE_WRAP = document.querySelector('.input_file_wrap');
			this.INPUT_FILE_LABEL = document.getElementById('file_label');
			this.INPUT_FILE = document.getElementById('user_file');
			this.PUBLISH_BTN = document.getElementById('publish_btn');
			this.DELETE_FILE_BTN = document.getElementById('delete_file');
			this.HIDE_FORM_BTN = document.getElementById('closer');
		}

		hide() {
			['.overlay', '#input'].forEach(el => document.querySelector(el).classList.remove('shown'));
		}

		show() {
			['.overlay', '#input'].forEach(el => document.querySelector(el).classList.add('shown'));
		}

		submit(e) {
			e.preventDefault();

			const FORM_ELEMENTS = Array.from(this.FORM_EL.elements);
			const DATA = {
				text: FORM_ELEMENTS[0].value.trim(),
				file: FORM_ELEMENTS[1].files[0],
				date: new Date(Date.now())
			};
			const newPost = new PostItem(DATA);

			return newPost.init();
		}

		reset() {
			this.FORM_EL.reset();

			return this.clearFileInput();
		}

		beautifyFileInput() {
			const FILE = this.INPUT_FILE.files[0];

			//add file name and display 'delete file' button
			this.INPUT_FILE_LABEL.innerText = FILE.name;
			this.INPUT_FILE_WRAP.classList.add('removable');

			return this.checkFileInputType(FILE);
		}

		checkFileInputType(file) {
			//check if the uploaded file is an image
			return file.type.substring(0, file.type.indexOf('/')) === 'image' ?
				this.checkFileInputSize(file) : this.disableSubmitButton();
		}

		checkFileInputSize(file) {
			//check if the uploaded image is 5Mb or less
			if (file.size > 5e+6) {
				this.INPUT_FILE_LABEL.innerText = 'Maximum image size - 5 MB';
				this.INPUT_FILE_WRAP.classList.add('removable');
			} else {
				return this.PUBLISH_BTN.removeAttribute('disabled');
			}
		}

		clearFileInput() {
			this.INPUT_FILE.value = null;
			this.INPUT_FILE_LABEL.innerText = 'Upload an image';
			this.INPUT_FILE_WRAP.classList.remove('removable');

			return this.disableSubmitButton();
		}

		disableSubmitButton() {
			return this.PUBLISH_BTN.setAttribute('disabled', '');
		}
	}

	const FORM = new Form();


	SHOW_FORM_BTN.addEventListener('click', FORM.show);
	FORM.HIDE_FORM_BTN.addEventListener('click', FORM.hide);
	FORM.FORM_EL.addEventListener('submit', (e) => FORM.submit(e));
	FORM.INPUT_FILE.addEventListener('change', FORM.beautifyFileInput.bind(FORM));
	FORM.DELETE_FILE_BTN.addEventListener('click', FORM.clearFileInput.bind(FORM));


	window.onload = () => FORM.reset();
})();
