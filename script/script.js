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

        // прописываем Local Storage для хранения созданных заказов
        const orders = JSON.parse(localStorage.getItem('freeOrders')) || [];

        const toStorage = () => {
            localStorage.setItem('freeOrders', JSON.stringify(orders));
        };

        // счетчик  времени, оставшегося до сдачи заказа
        const deadlineCalc = (deadline) => {
             const targetDate = new Date(deadline);
             const curDate = new Date();
             const day = Math.ceil(Math.abs(curDate - targetDate) / (1000 * 3600 * 24));

            const declOfNum = (n, t) => t[ (n%100>4 && n%100<20)? 2 : [2, 0, 1, 1, 1, 2][(n%10<5)?n%10:5] ];

            return day + ' ' + declOfNum(day, ['день', 'дня', 'дней']);
        };

        // рендерим строки таблицы с заказами
        const renderOrders = () => {

            ordersTable.textContent = '';

                orders.forEach((order, i) => {
                    ordersTable.innerHTML += `
                        <tr class="order ${order.active ? 'taken' : ''}" data-number-order="${i}">
                                <td>${i+1}</td>
                                <td>${order.title}</td>
                                <td class="${order.currency}"></td>
                                <td>${deadlineCalc(order.deadline)}</td>
                        </tr>`;
                });
        };

        // обработка кликов в модальных окнах
        const handlerModal = (event) => {
                const target = event.target;
                const modal = target.closest('.order-modal');
                const order = orders[modal.id];

                // создаем функцию, чтобы соблюсти принцип 'DRY'
                const baseAction = () => {
                    modal.style.display = 'none';
                    toStorage();
                    renderOrders();
                }

                // закрываем модальное окно
                if (target.closest('.close') || target === modal) {
                    modal.style.display = 'none';
                }

                // берем заказ в работу
                if (target.classList.contains('get-order')) {
                    order.active = true;
                    baseAction();
                }

                // отказываемся от выполнения
                if (target.id === 'capitulation') {
                    order.active = false;
                    baseAction();
                }

                // отмечаем заказ как выполненный и удаляем его
                if (target.id === 'ready') {
                    orders.splice(orders.indexOf(order), 1);
                    baseAction();
                }
        }

        // функция для открытия модальных окон
        const openModal = (numberOrder) => {
            const order = orders[numberOrder];

            // деструктуризация для извлечения всей информации из заказа
            const { title, firstName, email, phone, description, amount, currency, deadline, active = false } = order;

            // открываем модальное окно в зависимости от состояния заказа
            const modal = active ? modalOrderActive : modalOrder;

            // получаем элементы модального окна (информация о заказе) по классам
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
            deadlineBlock.textContent = deadlineCalc(deadline);
            currencyBlock.className = 'currency_img';
            currencyBlock.classList.add(currency);
            countBlock.textContent = amount;
            
            phoneBlock && (phoneBlock.href = 'tel:' + order.phone);

            modal.style.display = 'flex';

            // обработчик событий внутри модального окна
            modal.addEventListener('click', handlerModal);
        };

        // функция делегирования, обработчик клика по выбранному заказу
        ordersTable.addEventListener('click', (event) => {
            const target = event.target;
            const targetOrder = target.closest('.order');
                    if (targetOrder) {
                        openModal(targetOrder.dataset.numberOrder);
                    }
        })

        // обработчики кликов по кнопкам
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

            // добавляем новый заказ
            orders.push(obj);

            // сохранение заказов в Local Storage
            toStorage();

        });

})