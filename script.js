
// Product Information
let products = [
    {id: 1, name: "Headphone", price: 1500, rating: 4.8},
    {id: 2, name: "Keyboard", price: 2000, rating: 4.5},
    {id: 3, name: "Mouse", price: 800, rating: 4.7},
    {id: 4, name: "Speaker", price: 2500, rating: 4.6},
    {id: 5, name: "USB Drive", price: 500, rating: 4.2},
    {id: 6, name: "Monitor", price: 4000, rating: 4.9},
    {id: 7, name: "Webcam", price: 1200, rating: 4.3}
];


// Display Products
function displayProducts(list) {
    let container = document.getElementById("products");

    container.innerHTML = "";

    list.forEach(product => {
        container.innerHTML += `
            <div class="product">
                <h3>${product.name}</h3>

                <p>Price: ৳${product.price}</p>

                <p>Rating: ⭐ ${product.rating}</p>

                <label>
                    <input type="checkbox"
                    class="product-check"
                    value="${product.id}">
                    Select Product
                </label>
            </div>
        `;
    });
}


// QUICK SORT - Sort by Rating
function quickSort(arr) {

    if (arr.length <= 1) {
        return arr;
    }

    let pivot = arr[arr.length - 1];

    let left = [];
    let right = [];

    for (let i = 0; i < arr.length - 1; i++) {

        if (arr[i].rating > pivot.rating) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [
        ...quickSort(left),
        pivot,
        ...quickSort(right)
    ];
}


// Sort Products by Rating
function sortByRating() {

    products = quickSort(products);

    displayProducts(products);
}


// MERGE SORT - Sort by Price
function mergeSort(arr, order = "asc") {

    if (arr.length <= 1) {
        return arr;
    }

    let mid = Math.floor(arr.length / 2);

    let left = mergeSort(arr.slice(0, mid), order);
    let right = mergeSort(arr.slice(mid), order);

    return merge(left, right, order);
}


// Merge Function
function merge(left, right, order) {

    let result = [];

    while (left.length > 0 && right.length > 0) {

        let condition;

        if (order === "asc") {
            condition = left[0].price <= right[0].price;
        } else {
            condition = left[0].price >= right[0].price;
        }

        if (condition) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    return result.concat(left, right);
}


// Sort Price Low to High
function sortByPriceLow() {

    products = mergeSort(products, "asc");

    displayProducts(products);
}


// Sort Price High to Low
function sortByPriceHigh() {

    products = mergeSort(products, "desc");

    displayProducts(products);
}


// 0/1 KNAPSACK - Dynamic Programming
function knapsack(items, budget) {

    let n = items.length;

    let dp = Array.from(
        {length: n + 1},
        () => Array(budget + 1).fill(0)
    );

    // Build DP Table
    for (let i = 1; i <= n; i++) {

        for (let w = 0; w <= budget; w++) {

            if (items[i - 1].price <= w) {

                dp[i][w] = Math.max(
                    dp[i - 1][w],

                    items[i - 1].rating * 100 +
                    dp[i - 1][w - items[i - 1].price]
                );

            } else {

                dp[i][w] = dp[i - 1][w];

            }
        }
    }

    // Find Selected Products
    let selected = [];

    let w = budget;

    for (let i = n; i > 0; i--) {

        if (dp[i][w] !== dp[i - 1][w]) {

            selected.push(items[i - 1]);

            w -= items[i - 1].price;
        }
    }

    return {
        selected: selected,
        value: dp[n][budget]
    };
}


// Find Best Product Combination
function findBestCombination() {

    let budget = Number(
        document.getElementById("budget").value
    );

    let resultDiv = document.getElementById("result");

    if (!Number.isSafeInteger(budget) || budget <= 0) {
        resultDiv.innerHTML =
            "Please enter a valid positive whole-number budget.";
        return;
    }

    // Get Selected Products
    let checkboxes = document.querySelectorAll(
        ".product-check:checked"
    );

    let selectedIds = Array.from(checkboxes).map(
        checkbox => Number(checkbox.value)
    );

    if (selectedIds.length === 0) {
        resultDiv.innerHTML =
            "Please select at least one product.";
        return;
    }

    let selectedProducts = products.filter(
        product => selectedIds.includes(product.id)
    );

    // Apply Knapsack Algorithm
    let answer = knapsack(selectedProducts, budget);

    let totalPrice = 0;

    let output = "<h3>Recommended Products:</h3><ul>";

    answer.selected.forEach(product => {

        output += `
            <li>
                ${product.name} -
                ৳${product.price} -
                Rating: ${product.rating}
            </li>
        `;

        totalPrice += product.price;
    });

    output += "</ul>";

    output += `
        <p class="total">
            Total Price: ৳${totalPrice}
        </p>

        <p>
            Remaining Budget: ৳${budget - totalPrice}
        </p>

        <p>
            Total Rating Score: ${answer.value / 100}
        </p>
    `;

    resultDiv.innerHTML = output;
}


// Initial Display
displayProducts(products);
