//=========================================================
// IIIII  NNNNN  DDDDD  EEEEE  XXXXXX  
//=========================================================

$(document).ready(function () {

    // MOBILE MENU
    $('#mobileMenuBtn').click(function () {
        $('#mobileMenu').slideToggle(300);

        const icon = $(this).find('i');

        if (icon.hasClass('fa-bars')) {
            icon.removeClass('fa-bars').addClass('fa-xmark');
        } else {
            icon.removeClass('fa-xmark').addClass('fa-bars');
        }
    });

    // SLIDER
    let currentIdx = 0;
    const slidesList = $('.slider-item');
    const indicators = $('.dot-btn');
    const totalSlidesCount = slidesList.length;
    let slideTimer;

    function navigateSlide(index) {
        slidesList.removeClass('active').fadeOut(300);
        indicators.removeClass('active bg-white').addClass('bg-white/50');

        currentIdx = (index + totalSlidesCount) % totalSlidesCount;

        $(slidesList[currentIdx]).addClass('active').fadeIn(500);
        $(indicators[currentIdx]).addClass('active bg-white').removeClass('bg-white/50');
    }

    function moveToNext() {
        navigateSlide(currentIdx + 1);
    }

    function moveToPrev() {
        navigateSlide(currentIdx - 1);
    }

    function initSlideTimer() {
        slideTimer = setInterval(moveToNext, 5000);
    }

    function resetSlideTimer() {
        clearInterval(slideTimer);
        initSlideTimer();
    }

    $('#nextBtn').click(function () {
        moveToNext();
        resetSlideTimer();
    });

    $('#prevBtn').click(function () {
        moveToPrev();
        resetSlideTimer();
    });

    $('.dot-btn').click(function () {
        const targetIdx = parseInt($(this).attr('data-index'));
        navigateSlide(targetIdx);
        resetSlideTimer();
    });

    initSlideTimer();

    // ANALISIS KULIT
    $('#analyzeSkinBtn').click(function () {
        const ans1 = $('#skinQ1').val();
        const ans2 = $('#skinQ2').val();

        let diagnosaResult = "";
        let deskripsiTerapi = "";

        if (ans1 === "oily" && ans2 === "yes") {
            diagnosaResult = "Kulit Berminyak & Sensitif";
            deskripsiTerapi = "Disarankan memakai facial wash gentle dan pelembab ringan.";
        } else if (ans1 === "dry") {
            diagnosaResult = "Kulit Kering";
            deskripsiTerapi = "Gunakan pelembab yang membantu menjaga skin barrier.";
        } else if (ans1 === "combi") {
            diagnosaResult = "Kulit Kombinasi";
            deskripsiTerapi = "Gunakan produk seimbang untuk area berminyak dan kering.";
        } else {
            diagnosaResult = "Kulit Normal";
            deskripsiTerapi = "Pertahankan rutinitas skincare dasar: facial wash, pelembab, dan sunscreen.";
        }

        $('#skinResultText').text(diagnosaResult);
        $('#skinResultDesc').text(deskripsiTerapi);
        $('#skinResultPanel').hide().removeClass('hidden').fadeIn(500);
    });

});




//==========================================
// CCCCCC AAAAAA RRRRRR TTTTTT
//==========================================

function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        name: name,
        price: Number(price),
        image: image,
        qty: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    window.location.href = "../pages/cart.html";
}

function renderCart() {
    const cartList = document.getElementById("cartList");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartList || !cartTotal) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = `
            <p class="text-center text-gray-400 py-10">
                Keranjang masih kosong.
            </p>
        `;
        cartTotal.textContent = "Rp 0";
        return;
    }

    let total = 0;

    cart.forEach(function(item, index) {
        total += item.price * item.qty;

        cartList.innerHTML += `
            <div class="flex gap-4 items-center bg-brand-light p-4 rounded-xl border">
                <img src="${item.image}" class="w-20 h-20 object-cover rounded-lg">

                <div class="flex-grow">
                    <h3 class="font-bold text-brand-dark">${item.name}</h3>
                    <p class="text-sm text-brand-primary font-bold">
                        Rp ${item.price.toLocaleString("id-ID")}
                    </p>
                    <p class="text-xs text-gray-500">Jumlah: ${item.qty}</p>
                </div>

                <button onclick="removeCartItem(${index})" class="text-red-500 font-bold text-sm">
                    Hapus
                </button>
            </div>
        `;
    });

    cartTotal.textContent = "Rp " + total.toLocaleString("id-ID");
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function checkoutCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    window.location.href = "transaksi.html";
}

document.addEventListener("DOMContentLoaded", renderCart);




//==========================================
// TTTTTT RRRRRR AAAAAA NNNNNN SSSSSS
// TRANSAKSI
//==========================================

function formatRupiah(number) {
    return "Rp " + Number(number).toLocaleString("id-ID");
}

function renderTransaction() {
    const transactionItems = document.getElementById("transactionItems");
    const transactionSubtotal = document.getElementById("transactionSubtotal");
    const transactionShipping = document.getElementById("transactionShipping");
    const transactionTotal = document.getElementById("transactionTotal");

    if (!transactionItems || !transactionSubtotal || !transactionShipping || !transactionTotal) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let shipping = 10000;
    let subtotal = 0;

    transactionItems.innerHTML = "";

    if (cart.length === 0) {
        transactionItems.innerHTML = `
            <p class="text-gray-400 text-center py-8">
                Tidak ada produk yang diproses.
            </p>
        `;

        transactionSubtotal.textContent = "Rp 0";
        transactionShipping.textContent = "Rp 0";
        transactionTotal.textContent = "Rp 0";
        return;
    }

    cart.forEach(function (item) {
        let itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        transactionItems.innerHTML += `
            <div class="flex gap-4 items-center bg-brand-light p-4 rounded-xl border">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">

                <div class="flex-grow">
                    <h3 class="font-bold text-brand-dark text-sm">${item.name}</h3>
                    <p class="text-xs text-gray-500">Jumlah: ${item.qty}</p>
                    <p class="text-sm text-brand-primary font-bold">${formatRupiah(itemTotal)}</p>
                </div>
            </div>
        `;
    });

    transactionSubtotal.textContent = formatRupiah(subtotal);
    transactionShipping.textContent = formatRupiah(shipping);
    transactionTotal.textContent = formatRupiah(subtotal + shipping);
}

document.addEventListener("DOMContentLoaded", renderTransaction);


//==========================================
// FORM TRANSAKSI
//==========================================

document.addEventListener("DOMContentLoaded", function () {
    const transactionForm = document.getElementById("transactionForm");

    if (!transactionForm) return;

    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Tidak ada produk untuk diproses.");
            return;
        }

        const buyerData = {
            name: document.getElementById("buyerName").value,
            phone: document.getElementById("buyerPhone").value,
            address: document.getElementById("buyerAddress").value,
            payment: document.getElementById("paymentMethod").value
        };

        localStorage.setItem("buyerData", JSON.stringify(buyerData));

        window.location.href = "invoice.html";
    });
});

//==========================================
// INVOICEEE
//==========================================


function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(function(item) {
        total += item.qty;
    });

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = "(" + total + ")";
    }
}

document.addEventListener("DOMContentLoaded", updateCartCount);


function renderInvoicePage() {
    const invoiceItems = document.getElementById("invoiceItems");
    const invoiceSubtotal = document.getElementById("invoiceSubtotal");
    const invoiceShipping = document.getElementById("invoiceShipping");
    const invoiceTotal = document.getElementById("invoiceTotal");

    if (!invoiceItems || !invoiceSubtotal || !invoiceShipping || !invoiceTotal) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const buyerData = JSON.parse(localStorage.getItem("buyerData")) || {};

    document.getElementById("invoiceName").textContent = buyerData.name || "-";
    document.getElementById("invoicePhone").textContent = buyerData.phone || "-";
    document.getElementById("invoiceAddress").textContent = buyerData.address || "-";
    document.getElementById("invoicePayment").textContent = buyerData.payment || "-";

    invoiceItems.innerHTML = "";

    let subtotal = 0;
    const shipping = 10000;

    if (cart.length === 0) {
        invoiceItems.innerHTML = `
            <p class="text-center text-gray-400 py-6">
                Tidak ada data produk.
            </p>
        `;
        invoiceSubtotal.textContent = "Rp 0";
        invoiceShipping.textContent = "Rp 0";
        invoiceTotal.textContent = "Rp 0";
        return;
    }

    cart.forEach(function(item) {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        invoiceItems.innerHTML += `
            <div class="flex gap-4 items-center bg-brand-light p-4 rounded-xl border">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">

                <div class="flex-grow">
                    <h3 class="font-bold text-brand-dark text-sm">${item.name}</h3>
                    <p class="text-xs text-gray-500">Jumlah: ${item.qty}</p>
                    <p class="text-sm text-brand-primary font-bold">${formatRupiah(itemTotal)}</p>
                </div>
            </div>
        `;
    });

    invoiceSubtotal.textContent = formatRupiah(subtotal);
    invoiceShipping.textContent = formatRupiah(shipping);
    invoiceTotal.textContent = formatRupiah(subtotal + shipping);
}

document.addEventListener("DOMContentLoaded", renderInvoicePage);