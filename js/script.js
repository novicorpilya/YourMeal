'use strict';
    // Реализация табов
// Получаем все элементы с атрибутом data-tab
    const tabHeaders = document.querySelectorAll("[data-category]");
    // Получаем все элементы с атрибутом data-tab-content
    const tabContent = document.querySelectorAll("[data-tab-content]");

// Итерируемся по каждому элементу с атрибутом data-tab
tabHeaders.forEach(tab => {
    // Добавляем обработчик события клика
    tab.addEventListener("click", () => {
        // Деструктуризация: получаем значение атрибута data-tab и присваиваем его переменной targetTab
        const { tab: targetTab } = tab.dataset;

        // Итерируемся по каждому элементу с атрибутом data-tab-content
        tabContent.forEach(content => {
            // Метод classList.toggle добавляет или удаляет класс "_hidden" в зависимости от условия
            content.classList.toggle("_hidden", content.id !== targetTab);
        });
    });
});

// Открытие поп-ап по нажатию на кнопку Добавить
    const popupButtons = document.querySelectorAll('.content-goods__card[data-popup]');

    function openPopup(targetPopupId) {
        const popup = document.querySelector(targetPopupId);
        popup.classList.add('popup_show');
        document.documentElement.classList.add('popup-show');
        document.documentElement.classList.add('lock');
    }

    function closePopup() {
        const visiblePopup = document.querySelector('.popup_show');
        if (visiblePopup) {
            visiblePopup.classList.remove('popup_show');
            document.documentElement.classList.remove('popup-show');
            document.documentElement.classList.remove('lock');
        }
    }


    popupButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPopupId = button.getAttribute('data-popup');
            openPopup(targetPopupId);
        });
    });

    // Добавляем обработчик для кнопок закрытия попапа
    const closePopupButtons = document.querySelectorAll('[data-close]');
    closePopupButtons.forEach(button => {
        button.addEventListener('click', closePopup);
    });



// Обработка счетчика и цены внутри поп апов

 // Получаем все элементы с классом 'order-popup-goods__bill'
const prices = document.querySelectorAll('.order-popup-goods__bill');
// Получаем все элементы с атрибутом 'data-current="counter"'

// Получаем все элементы с атрибутом 'data-action="plus"'
const plusButtons = document.querySelectorAll('[data-action="plus"]');
// Получаем все элементы с атрибутом 'data-action="minus"'
const minusButtons = document.querySelectorAll('[data-action="minus"]');

// Итерируемся по всем кнопкам "+" и добавляем обработчик событий
plusButtons.forEach((plusButton, index) => {
    plusButton.addEventListener('click', () => {
        updateCounter(index, 1);
    });
});

// Итерируемся по всем кнопкам "-" и добавляем обработчик событий
minusButtons.forEach((minusButton, index) => {
    minusButton.addEventListener('click', () => {
        updateCounter(index, -1);
    });
});

// Функция для обновления счетчика и цены
function updateCounter(index, value) {
    let currentValue = parseInt(counterWrappers[index].innerText);
    currentValue += value;
    
    // Убеждаемся, что currentValue не опускается ниже 1
    currentValue = Math.max(currentValue, 1);

    counterWrappers[index].innerText = currentValue;
    
    // Получим начальную цену из атрибута data-price
    const initialPrice = parseInt(prices[index].getAttribute('data-price'));
    
    // Обновим цену при изменении счетчика
    updateTotalPrice(initialPrice * currentValue, index);
}

// Функция для обновления общей цены
function updateTotalPrice(newPrice, index) {
    prices[index].innerText = `${newPrice}₽`;
}








// Обработка внутри корзины
// Получаем все элементы корзины
const cartWrapper = document.querySelector('.market-basket__order');
const headCountGoods = document.querySelector('.head-market-basket__count-goods');
const totalValue = document.querySelector('.total-market-basket__value');
const counterWrappers = document.querySelectorAll('[data-current="counter"]');

// Итерируемся по всем кнопкам "Добавить" и добавляем обработчик событий
const addToCartButtons = document.querySelectorAll('[data-cart]');
addToCartButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const card = button.closest(".popup-goods");
        const productInfo = {
            id: card.dataset.id,
            imgSrc: card.querySelector(".product-image").getAttribute("src"),
            title: card.querySelector(".popup-goods__title").innerText,
            weight: card.querySelector(".description-popup-goods__weight").innerText,
            price: card.querySelector(".order-popup-goods__bill").innerText,
            priceId: card.querySelector(".order-popup-goods__bill").getAttribute("data-price"),
            counter: counterWrappers[index].innerText
        };
        
        const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);
        if (itemInCart) {
            const counterElement = itemInCart.querySelector('[data-current="counter"]');
            counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter);
        } else {
            const cartItemHTML = `
                <div class="market-basket__card card-market-basket" data-id=${productInfo.id}>
                    <div class="card-market-basket__image">
                        <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
                    </div>
                    <div class="card-market-basket__definition definition-card">
                        <div class="definition-card__name">${productInfo.title}</div>
                        <div class="definition-card__weight">${productInfo.weight}</div>
                        <div class="definition-card__price" data-price = '${productInfo.priceId}'>${productInfo.price}</div>
                    </div>
                    <div class="card-market-basket__count order-popup-goods__count">
                        <div class="order-popup-goods__count-box" data-counter-wrapper>
                            <span data-action-market="minus">-</span>
                            <span data-current-market="counter">${productInfo.counter}</span>
                            <span data-action-market="plus">+</span>
                        </div>
                    </div>
                </div>`;

            cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
        }



        // Сбрасываем счетчик в попапе
        counterWrappers[index].innerText = "1";
          // Сбрасываем цену в попапе до исходного значения
          resetPopupPrice();

        // Закрываем попап
        closePopup();
        // Обновляем количество товаров в шапке
        updateHeadCountGoods();

         // Получаем элемент карточки товара

// Получаем все элементы корзины
const cartItems = document.querySelectorAll('.market-basket__card');

// Итерируемся по всем товарам в корзине
cartItems.forEach(cartItem => {
    // Получаем элементы для работы с счетчиком и ценой внутри текущего товара
    const counterElement = cartItem.querySelector('[data-current-market="counter"]');
    const priceElement = cartItem.querySelector('.definition-card__price');
    const minusButton = cartItem.querySelector('[data-action-market="minus"]');
    const plusButton = cartItem.querySelector('[data-action-market="plus"]');

    // Проверяем, были ли уже добавлены обработчики событий
    const hasEventListeners = minusButton.hasAttribute('data-event-listeners');

    if (!hasEventListeners) {
        // Добавляем обработчик события для кнопки "-"
        minusButton.addEventListener('click', () => {
            updateCounter(-1);
        });

        // Добавляем обработчик события для кнопки "+"
        plusButton.addEventListener('click', () => {
            updateCounter(1);
        });

        // Устанавливаем атрибут для указания наличия обработчиков
        minusButton.setAttribute('data-event-listeners', 'true');
    }

    // Функция для обновления счетчика и цены
    function updateCounter(value) {
        let currentValue = parseInt(counterElement.innerText);
        currentValue += value;

        // Убеждаемся, что currentValue не опускается ниже 1
        currentValue = Math.max(currentValue, 0);

        counterElement.innerText = currentValue;

        // Получим начальную цену из атрибута data-price
        const initialPrice = parseInt(priceElement.getAttribute('data-price'));

        // Обновим цену при изменении счетчика
        updateTotalPrice(initialPrice * currentValue);
        // Проверяем, если количество стало 0, удаляем товар из корзины
        if (currentValue === 0) {
            removeCartItem();
            updateHeadCountGoods();
            }
    }

    // Функция для удаления товара из корзины
function removeCartItem() {
    const cartItemContainer = cartItem.parentElement;
    cartItemContainer.removeChild(cartItem);
    calcCartPrice(); // Обновляем общую стоимость после удаления товара
}

    // Функция для обновления общей цены
    function updateTotalPrice(newPrice) {
        priceElement.innerText = `${newPrice}₽`;
        calcCartPrice();
    }
});

         

                        
    });

});



// Функция для сброса цены в попапе
function resetPopupPrice() {
    // Получаем все элементы с классом 'order-popup-goods__bill'
    const prices = document.querySelectorAll('.order-popup-goods__bill');

    // Итерируемся по всем элементам и сбрасываем цену до исходного значения
    prices.forEach(priceElement => {
        const initialPrice = parseFloat(priceElement.getAttribute('data-price'));
        priceElement.innerText = `${initialPrice} ₽`;
    });
}

function updateHeadCountGoods() {
    // Обновляем количество товаров в шапке корзины
    const cartItems = document.querySelectorAll('.card-market-basket');
    headCountGoods.innerText = cartItems.length;
    calcCartPrice();
}

// После добавления товара в корзину вызываем функцию обновления
updateHeadCountGoods();

function calcCartPrice() {
    // Получаем все цены в корзине и считаем общую стоимость
    const cartItems = document.querySelectorAll('.card-market-basket');
    const deliveryCost = document.querySelector(".free-delivery-market-basket__text");
    const deliveryBlock = document.querySelector(".free-delivery-market-basket");

    let total = 0;
    cartItems.forEach(item => {
        const priceElement = item.querySelector('.definition-card__price');
        const price = parseInt(priceElement.innerText.replace('₽', '').trim());
        total += price;
    });

    if (total > 0) deliveryBlock.classList.remove("_none");
    else deliveryBlock.classList.add("_none"); 

    if (total >= 1000) {
        deliveryCost.innerText = "Бесплатная доставка";
        deliveryCost.classList.add("_green");
    } else {
        deliveryCost.innerText = "Доставка 350 ₽";
        deliveryCost.classList.remove("_green");
    }

    // Обновляем общую стоимость в шапке корзины
    totalValue.innerText = `${total} ₽`;
}





// Кнопки
const radioCarry = document.querySelector(".radio__carry");
const radioDelivery = document.querySelector(".radio__delivery");
const boxDelivery = document.querySelector(".delivery-box");
radioCarry.addEventListener("click", (function() {
    boxDelivery.style.display = "none";
    radioDelivery.classList.remove("_active");
    radioCarry.classList.add("_active");
}));
radioDelivery.addEventListener("click", (function() {
    boxDelivery.style.display = "block";
    radioCarry.classList.remove("_active");
    radioDelivery.classList.add("_active");
    
}));
// Валидация формы
function validateForm() {
    // Валидация телефона
    const phoneInput = document.querySelector('.input__tel');
    const phoneRegex = /^\+?[0-9]+$/;

    if (!phoneRegex.test(phoneInput.value)) {
        alert('Пожалуйста, введите корректный номер телефона.');
        return false;
    }


    if (!radioCarry.classList.contains('_active') && !radioDelivery.classList.contains('_active')) {
        alert('Пожалуйста, выберите способ доставки.');
        return false;
    }

    // Если выбрана доставка, убедитесь, что введен адрес
    if (radioDelivery.classList.contains('_active')) {
        const addressInput = document.querySelector('.input__adress');
    // Проверка, является ли адрес непустым
    if (addressInput.value.trim() === '') {
        alert('Пожалуйста, укажите адрес доставки.');
        return false;
    }
    }
    

    // Все проверки пройдены, форма валидна
    return true;
}

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            localStorage.setItem('formData', JSON.stringify(object));
            
            fetch('server.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            }).then(data => data.text())
            .then(data => {
                if (validateForm()) {
                    // Если валидация успешна, тогда отправляем форму
                    console.log(data);
                    alert('Спасибо за заявку!');
                    boxDelivery.style.display = "none";
                    radioDelivery.classList.remove("_active");
                    deliveryPopup.classList.remove('popup_show');
                    localStorage.removeItem('formData');
                }
            }).catch(() => {
                alert('Что-то пошло не так...');
            }).finally(() => {
                form.reset();
            });
        });
    }

const formBtn = document.querySelector('form');

postData(formBtn);


const orderForm = document.querySelector(".market-basket__button");
// Получаем элемент с id "delivery"
const deliveryPopup = document.querySelector('.popup')
        // Добавляем обработчик события для кнопки
        orderForm.addEventListener('click', function () {
            // Находим все товары в корзине
            const cartItems = document.querySelectorAll('.card-market-basket');
            if (cartItems.length > 0) {
                       // Создаем массив для хранения информации о товарах
        const cartData = [];
        const deliveryPrice = document.querySelector('.free-delivery-market-basket__text').innerText;
                            // Итерируемся по товарам и удаляем их
            cartItems.forEach(cartItem => {
                const productId = cartItem.getAttribute('data-id');
                const productName = cartItem.querySelector('.definition-card__name').innerText;
                const productPrice = cartItem.querySelector('.definition-card__price').getAttribute('data-price');
                const productCount = cartItem.querySelector('[data-current-market="counter"]').innerText;
    
                // Добавляем информацию о товаре в массив
                cartData.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    count: productCount,
                    delivery: deliveryPrice
                });
                cartItem.remove();
            });
             // Сохраняем информацию о товарах в localStorage
            localStorage.setItem('cartData', JSON.stringify(cartData));



            // Получаем сохраненные данные из localStorage
            const storedCartData = localStorage.getItem('cartData');

            // Проверяем, есть ли сохраненные данные
            if (storedCartData) {
                // Если есть, преобразуем JSON-строку обратно в объект
                const cartData = JSON.parse(storedCartData);

                // Выводим информацию в консоль (или выполните нужные вам действия)
                console.log('Сохраненные данные в корзине:', cartData);
            // Так как данные никуда не отправляются просто удаляем их имитируя, что клиент не сделает заказ через 15 мин
            setTimeout(function () {
                // Удаляем данные из localStorage через 15 минут
                localStorage.removeItem(cartData);
                console.log('Данные удалены из localStorage');
            }, 15 * 60 * 1000); // 15 минут в миллисекундах
            } else {
                console.log('Нет сохраненных данных в корзине.');
            }


                // Обновляем общую стоимость в корзине (если необходимо)
                updateHeadCountGoods();
                // Если корзина не пуста, делаем блок видимым
                deliveryPopup.classList.add('popup_show');
            } else {
                // Если корзина пуста, выполняем другие действия или выводим сообщение
                alert('Корзина пуста. Добавьте товары перед оформлением заказа.');
                // Можно также предпринять другие действия, например, отменить событие или перенаправить пользователя
            }

        });