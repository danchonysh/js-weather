const Lib = {}

const _creatButtons = (buttons = []) => {
	if (buttons.length) {
		document.createElement('div')
	}
	const footer =  document.createElement('div')
	footer.classList.add('modal__footer')

	buttons.forEach(btn => {
		const $btn = document.createElement('button')
		$btn.textContent = btn.text
		$btn.classList.add('modal__button', btn.type)
		$btn.addEventListener('click', btn.handler)
		footer.appendChild($btn)
	})
	return footer
}

Element.prototype.appendAfter = function(el) {
	el.parentNode.insertBefore(this, el.nextSibling)
}

const _createModal = (options) => {
	const DEF = 'min(400px, 90%)'
	const modal = document.createElement("aside");
	modal.classList.add("modal");
 	options.closable ? modal.setAttribute("data-close", true) : null;
  	modal.insertAdjacentHTML(
    "afterbegin",
    `
		<div class="modal__window" style="width: ${options.width || DEF}">
			${
        options.closable
          ? `<span class="modal__close" data-close="true">&times;</span>`
          : ""
      }
			<h2 class="modal__header">${options.title}</h2>
			<div class="modal__content" data-content>${options.content || "Empty..."}</div>
		</div>
	`
  );

  document.body.appendChild(modal)

  const footer = _creatButtons(options.footerButtons)
  options.footerButtons ? footer.appendAfter(modal.querySelector('[data-content]')) : null

  return modal
};

Lib.modal = function (options) {
  const $modal = _createModal(options);

  const methods = {
    open() {
	  	$modal.classList.remove("hide");
      $modal.classList.add("show");
      $modal.children[0].classList.remove("close");
      $modal.children[0].classList.add("open");
    },
    close() {
      $modal.classList.remove("show")
      $modal.classList.add("hide")
      $modal.children[0].classList.remove("open")
      $modal.children[0].classList.add("close")
    },
    destroy() {
      setTimeout(() => document.body.removeChild($modal), 250)
      $modal.removeEventListener("click", listener)
    }
  }

  const listener = (el) => {
    if (el.target.dataset.close) {
      methods.close()
      setTimeout(methods.destroy(), 300)
    }
  }

  $modal.addEventListener("click", listener)
  return methods
}
