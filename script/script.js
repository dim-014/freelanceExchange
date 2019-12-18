document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const customer = document.getElementById('customer');
    const freelancer = document.getElementById('freelancer');
    const blockCustomer = document.getElementById('block-customer');
    const blockFreelancer = document.getElementById('block-freelancer');
    const blockChoice = document.getElementById('block-choice');
    const btnExit = document.getElementById('btn-exit');
    const formCustomer = document.getElementById('form-customer');
    const ordersTable = document.getElementById('orders');
    const modalOrder = document.getElementById('order_read');
    const modalOrderActive = document.getElementById('order_active');
    const modalClose = document.querySelector('.close');

    const orders = [];

    const renderOrders = () => {

        ordersTable.textContent = '';

        orders.forEach((order, i) => {
            ordersTable.innerHTML += `
                                <tr class="order" data-number-order="${i}">
                                    <td>${i+1}</td>
                                    <td>${order.title}</td>
                                    <td class="${order.currency}"></td>
                                    <td>${order.deadline}</td>
                                </tr>`;
        });
    };

    const openModal = (numberOrder) => {
        const order = orders[numberOrder];
        const modal = order.active ? modalOrderActive : modalOrder;

        // получаем элементы модального окна по классам
        const firstNameBlock = document.querySelector('.firstName');
        const titleBlock = document.querySelector('.modal-title');
        const emailBlock = document.querySelector('.email');
        const descriptionBlock = document.querySelector('.description');
        const deadlineBlock = document.querySelector('.deadline');
        const currencyBlock = document.querySelector('.currency_img');
        const countBlock = document.querySelector('.count');
        const phoneBlock = document.querySelector('.phone');

        titleBlock.textContent = order.title;
        firstNameBlock.textContent = order.firstName;
        emailBlock.textContent = order.email;
        emailBlock.setAttribute('href', `mailto: ${email}`);
        descriptionBlock.textContent = order.description;
        deadlineBlock.textContent = order.deadline;
        currencyBlock.classList.add('.currency');
        countBlock.textContent = order.amount;
        phoneBlock.textContent = order.phone;
        phoneBlock.setAttribute('href', `tel: ${phone}`);

        modal.style.display = 'block';
    };

    ordersTable.addEventListener('click', (event) => {
        const target = event.target;
        const targetOrder = target.closest('.order');
        if (targetOrder) {
            openModal(targetOrder.dataset.numberOrder);
        }
    })

    // закрываем модальное окно
    modalClose.addEventListener('click', () => {
        const currentModal = event.target.closest('.modal');
        currentModal.style.display = 'none';
    });

    customer.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        blockCustomer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    freelancer.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        renderOrders();
        blockFreelancer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    btnExit.addEventListener('click', () => {
        btnExit.style.display = 'none';
        blockCustomer.style.display = 'none';
        blockFreelancer.style.display = 'none';
        blockChoice.style.display = 'block';
    });

    formCustomer.addEventListener('submit', (e) => {
        e.preventDefault();

        const obj = {};

        /*
        [...formCustomer.elements].forEach((elem) => {
            if ((elem.tagName === 'INPUT' && elem.type !== 'radio') || (elem.type === 'radio' && elem.checked) || elem.tagName === 'TEXTAREA') {

                obj[elem.name] = elem.value;

                if (elem.type !== 'radio') {
                    elem.value = '';
                }
            }
        });
                    альтернативный способ перебора элементов через forEach
        */

        /*
        const elements = [...formCustomer.elements].filter((elem) => ((elem.tagName === 'INPUT' && elem.type !== 'radio') || (elem.type === 'radio' && elem.checked) || elem.tagName === 'TEXTAREA'));
                    альтернативный способ перебора элементов через filter
        */

        for (const elem of formCustomer.elements) {
            if ((elem.tagName === 'INPUT' && elem.type !== 'radio') || (elem.type === 'radio' && elem.checked) || elem.tagName === 'TEXTAREA') {

                obj[elem.name] = elem.value;

                if (elem.type !== 'radio') {
                    elem.value = '';
                }
            }
        };

        formCustomer.reset();

        orders.push(obj);
        console.log(orders);

    });

})