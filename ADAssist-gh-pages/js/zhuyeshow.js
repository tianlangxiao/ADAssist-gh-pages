(function () {
    // 增加 container
    let main = document.createElement('div');
    main.classList.add('container-fluid');
    document.body.prepend(main);
    let flex = document.createElement('div');
    flex.classList.add('d-flex', 'justify-content-around', 'flex-column', 'flex-md-row', 'flex-wrap');
    main.appendChild(flex);

    // 增加各量表 Card 样式
    let h2s = document.querySelectorAll('h2');
    h2s.forEach((el) => {
        let elN1 = el.nextElementSibling;
        let elN2 = elN1.nextElementSibling;
        let card = document.createElement('div');
        let cardTitle = document.createElement('div');
        let cardText = document.createElement('div');
        card.classList.add('card', 'm-2');
        cardTitle.classList.add('card-title', 'h4', 'm-2');
        cardTitle.innerHTML = el.innerHTML;
        cardText.classList.add('card-text', 'm-2');
        cardText.appendChild(elN1);
        if (elN2.tagName !== 'H2') {
            cardText.appendChild(elN2);
        }
        el.remove();
        card.appendChild(cardTitle);
        card.appendChild(cardText);
        flex.appendChild(card)
    })

    // 修改表格样式
    document.querySelectorAll('table').forEach((el) => {
        el.classList.add('table-striped', 'table-sm', 'table-hover');
    })
})();