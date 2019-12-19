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

        const orders = JSON.parse(localStorage.getItem('freeOrders')) || [];

        const toStorage = () => {
            localStorage.setItem('freeOrders', JSON.stringify(orders));
        };

        // функция составления таблицы с заказами из вышесозданного массива
        const renderOrders = () => {

            ordersTable.textContent = '';

                orders.forEach((order, i) => {
                    ordersTable.innerHTML += `
                        <tr class="order ${order.active ? 'taken' : ''}" data-number-order="${i}">
                                <td>${i+1}</td>
                                <td>${order.title}</td>
                                <td class="${order.currency}"></td>
                                <td>${order.deadline}</td>
                        </tr>`;
                });
        };

        const handlerModal = (event) => {
                const target = event.target;
                const modal = target.closest('.order-modal');
                const order = orders[modal.id];

                const baseAction = () => {
                    modal.style.display = 'none';
                    toStorage();
                    renderOrders();
                }

                if (target.closest('.close') || target === modal) {
                    modal.style.display = 'none';
                }

                if (target.classList.contains('get-order')) {
                    order.active = true;
                    baseAction();
                }

                if (target.id === 'capitulation') {
                    order.active = false;
                    baseAction();
                }

                if (target.id === 'ready') {
                    orders.splice(orders.indexOf(order), 1);
                    baseAction();
                }
        }

        // функция для открытия модального окна с заказами
        const openModal = (numberOrder) => {
            const order = orders[numberOrder];

            // деструктуризация
            const { title, firstName, email, phone, description, amount, currency, deadline, active = false } = order;

            const modal = active ? modalOrderActive : modalOrder;

            // получаем элементы модального окна по классам
            const firstNameBlock = modal.querySelector('.firstName');
            const titleBlock = modal.querySelector('.modal-title');
            const emailBlock = modal.querySelector('.email');
            const descriptionBlock = modal.querySelector('.description');
            const deadlineBlock = modal.querySelector('.deadline');
            const currencyBlock = modal.querySelector('.currency_img');
            const countBlock = modal.querySelector('.count');
            const phoneBlock = modal.querySelector('.phone');

            // выводим элементы модального окна
            modal.id = numberOrder;
            titleBlock.textContent = title;
            firstNameBlock.textContent = firstName;
            emailBlock.textContent = email;
            emailBlock.href = 'mailto:' + email;
            descriptionBlock.textContent = description;
            deadlineBlock.textContent = deadline;
            currencyBlock.className = 'currency_img';
            currencyBlock.classList.add(currency);
            countBlock.textContent = amount;
            
            phoneBlock && (phoneBlock.href = 'tel:' + order.phone);

            modal.style.display = 'flex';

            modal.addEventListener('click', handlerModal);
        };

        // функция делегирования
        ordersTable.addEventListener('click', (event) => {
            const target = event.target;
            const targetOrder = target.closest('.order');
                    if (targetOrder) {
                        openModal(targetOrder.dataset.numberOrder);
                    }
        })

        // обработчики события 
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

            // сбор данных из формы и перебор
            for (const elem of formCustomer.elements) {
                if ((elem.tagName === 'INPUT' && elem.type !== 'radio') || (elem.type === 'radio' && elem.checked) || elem.tagName === 'TEXTAREA') {

                    obj[elem.name] = elem.value;

                    if (elem.type !== 'radio') {
                        elem.value = '';
                    }
                }
            };

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

            // очистка формы
            formCustomer.reset();

            orders.push(obj);

            toStorage();

        });

})