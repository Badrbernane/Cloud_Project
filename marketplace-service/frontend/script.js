// Minimal frontend to exercise the marketplace-service REST API with image upload.
const BACKEND_BASE = "http://localhost:8085";
const API_BASE = `${BACKEND_BASE}/api/market/products`;
const USER_SERVICE_BASE = "http://localhost:8081/api/users";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("product-form");
    const messageEl = document.getElementById("message");
    const loadBtn = document.getElementById("load-products");
    const refreshBtn = document.getElementById("refresh-products");
    const refreshMyBtn = document.getElementById("refresh-my-products");
    const resetBtn = document.getElementById("reset-form");
    const cardsContainer = document.getElementById("products");
    const myCardsContainer = document.getElementById("my-products");
    const myProductsMessage = document.getElementById("my-products-message");
    const usernameDisplay = document.getElementById("username-display");
    const sellerIdInput = form?.elements?.sellerId;

    let lastProducts = [];

    const loadUserFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get("userId");
        const username = params.get("username");
        const email = params.get("email");
        const countryCode = params.get("countryCode");

        if (userId) {
            localStorage.setItem("userId", userId);
            localStorage.setItem("marketplaceSellerId", userId);
        }
        if (username) {
            localStorage.setItem("username", username);
            localStorage.setItem("marketplaceUsername", username);
        }
        if (email) localStorage.setItem("email", email);
        if (countryCode) localStorage.setItem("countryCode", countryCode);

        if (userId) {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    };

    loadUserFromURL();

    const showSellerId = (value) => {
        if (sellerIdInput) {
            sellerIdInput.value = value || "";
        }
    };

    const currentSellerId = () => {
        const fromInput = sellerIdInput?.value?.trim();
        if (fromInput) return fromInput;
        const storedSeller = localStorage.getItem("marketplaceSellerId") || localStorage.getItem("userId");
        return storedSeller?.trim() || "";
    };

    const setUsernameDisplay = (value) => {
        if (usernameDisplay) {
            usernameDisplay.textContent = value || "Non connecté";
        }
    };
    // Default state
    setUsernameDisplay(localStorage.getItem("marketplaceUsername") || localStorage.getItem("username") || "Non connecté");

    const fetchAndDisplayUsername = async (userId) => {
        if (!userId) {
            setUsernameDisplay("Non connecté");
            return;
        }
        try {
            const res = await fetch(`${USER_SERVICE_BASE}/${encodeURIComponent(userId)}`);
            if (res.ok) {
                const data = await res.json();
                const username = data.username || data.email || userId;
                setUsernameDisplay(username);
                localStorage.setItem("marketplaceUsername", username);
                return;
            }
        } catch (e) {
            // ignore network errors, fallback below
        }
        setUsernameDisplay(userId);
    };

    const bootstrapIdentity = () => {
        const params = new URLSearchParams(window.location.search);
        const fromQueryUser = params.get("username");
        const fromQuerySeller = params.get("sellerId");
        const storedUsername = localStorage.getItem("marketplaceUsername") || localStorage.getItem("username");
        const storedSeller = localStorage.getItem("marketplaceSellerId") || localStorage.getItem("userId");

        if (fromQuerySeller && sellerIdInput) {
            sellerIdInput.value = fromQuerySeller;
            localStorage.setItem("marketplaceSellerId", fromQuerySeller);
            fetchAndDisplayUsername(fromQuerySeller);
        } else if (storedSeller && sellerIdInput && !sellerIdInput.value) {
            sellerIdInput.value = storedSeller;
        }

        if (fromQueryUser) {
            setUsernameDisplay(fromQueryUser);
            localStorage.setItem("marketplaceUsername", fromQueryUser);
        } else if (storedUsername) {
            setUsernameDisplay(storedUsername);
        } else if (storedSeller || fromQuerySeller) {
            setUsernameDisplay(storedSeller || fromQuerySeller);
        } else if (storedUsername) {
            setUsernameDisplay(storedUsername);
        } else {
            fetchAndDisplayUsername(sellerIdInput?.value || storedSeller || fromQuerySeller);
        }
    };

    bootstrapIdentity();
    if (sellerIdInput) {
        sellerIdInput.readOnly = true; // sellerId injecté par session/URL/localStorage
    }

    const setMessage = (type, text, detail) => {
        messageEl.className = type ? type : "";
        messageEl.textContent = detail ? `${text} — ${detail}` : text;
    };

    const handleErrorResponse = async (response) => {
        let bodyText = "";
        try {
            const data = await response.json();
            bodyText = JSON.stringify(data);
        } catch (_) {
            bodyText = await response.text();
        }
        setMessage("error", `Erreur API (${response.status})`, bodyText || "Réponse vide");
        throw new Error(bodyText || "API error");
    };

    const renderProducts = (products) => {
        const sellerId = currentSellerId();
        const visible = sellerId ? products.filter((p) => (p.sellerId || "").toString() !== sellerId) : products;
        if (!visible.length) {
            cardsContainer.innerHTML = '<div class="empty">Aucun produit (ou uniquement vos produits).</div>';
            return;
        }
        const cards = visible.map((p) => {
            const price = p.price != null ? `<span class="price">${p.price} ${p.currency || "MAD"}</span>` : "";
            const status = p.status ? `<span class="status">${p.status}</span>` : "";
            const images = (p.imageUrls || []).map((url) => {
                const safeUrl = url?.startsWith("http") ? url : `${BACKEND_BASE}${url}`;
                return `<img src="${safeUrl}" alt="product image">`;
            }).join("");
            return `
                <article class="card">
                    <h3>${p.title ?? "Sans titre"}</h3>
                    <div class="meta">${price} ${status}</div>
                    <p class="meta">Catégorie: ${p.category ?? "-"}</p>
                    <p class="meta">Ville: ${p.city ?? "-"}</p>
                    <p class="meta">Téléphone: ${p.phoneNumber ?? "-"}</p>
                    <p class="meta">Vendeur: ${p.sellerId ?? "-"}</p>
                    <div class="thumbs">${images || "<span class='meta'>Aucune image</span>"}</div>
                    <div class="upload-row" data-product-id="${p.id}" data-seller-id="${p.sellerId}">
                        <input type="file" accept="image/*" class="file-input">
                        <button type="button" class="secondary upload-btn">Uploader une image</button>
                    </div>
                </article>
            `;
        });
        cardsContainer.innerHTML = cards.join("");
    };

    const renderMyProducts = (products) => {
        const sellerId = currentSellerId();
        if (!sellerId) {
            myCardsContainer.innerHTML = "";
            if (myProductsMessage) myProductsMessage.textContent = "Renseignez un Seller ID (UUID) pour voir vos produits.";
            return;
        }
        const mine = products.filter((p) => (p.sellerId || "").toString() === sellerId);
        if (!mine.length) {
            myCardsContainer.innerHTML = "";
            if (myProductsMessage) myProductsMessage.textContent = "Aucun produit pour ce vendeur.";
            return;
        }
        const cards = mine.map((p) => {
            const price = p.price != null ? `<span class="price">${p.price} ${p.currency || "MAD"}</span>` : "";
            const status = p.status ? `<span class="status">${p.status}</span>` : "";
            const images = (p.imageUrls || []).map((url) => {
                const safeUrl = url?.startsWith("http") ? url : `${BACKEND_BASE}${url}`;
                return `<img src="${safeUrl}" alt="product image">`;
            }).join("");
            return `
                <article class="card">
                    <h3>${p.title ?? "Sans titre"}</h3>
                    <div class="meta">${price} ${status}</div>
                    <p class="meta">Catégorie: ${p.category ?? "-"}</p>
                    <p class="meta">Ville: ${p.city ?? "-"}</p>
                    <p class="meta">Téléphone: ${p.phoneNumber ?? "-"}</p>
                    <p class="meta">Vendeur: ${p.sellerId ?? "-"}</p>
                    <div class="thumbs">${images || "<span class='meta'>Aucune image</span>"}</div>
                </article>
            `;
        });
        myCardsContainer.innerHTML = cards.join("");
        if (myProductsMessage) myProductsMessage.textContent = "";
    };

    const ensureSellerId = async () => {
        const sid = currentSellerId();
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        if (!sid) {
            setMessage("error", "Seller ID manquant", "Ajoutez ?sellerId=<uuid> dans l'URL ou enregistrez-le dans localStorage (marketplaceSellerId).");
            showSellerId("");
            return null;
        }
        if (!uuidRegex.test(sid)) {
            setMessage("error", "Seller ID invalide", "Le sellerId doit être un UUID (36 caractères).");
            showSellerId(sid);
            return null;
        }
        showSellerId(sid);
        setUsernameDisplay(sid); // at minimum display the UUID
        return sid;
    };

    const loadProducts = async () => {
        setMessage("", "Chargement des produits...");
        const sid = await ensureSellerId();
        if (!sid) {
            cardsContainer.innerHTML = '<div class="empty">Seller ID requis pour charger les produits.</div>';
            myCardsContainer.innerHTML = "";
            return;
        }
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) {
                await handleErrorResponse(res);
                return;
            }
            const data = await res.json();
            lastProducts = data;
            renderProducts(lastProducts);
            renderMyProducts(lastProducts);
            setMessage("success", "Produits chargés");
        } catch (err) {
            alert("Impossible d'appeler le backend. Vérifiez que le service tourne sur le port 8085.");
            setMessage("error", "Backend injoignable", err.message);
        }
    };

    const uploadImage = async (productId, sellerId, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_BASE}/${productId}/images?sellerId=${encodeURIComponent(sellerId)}`, {
            method: "POST",
            body: formData
        });
        if (!res.ok) {
            await handleErrorResponse(res);
            return null;
        }
        return res.json();
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const fd = new FormData(form);
        const sid = await ensureSellerId();
        if (!sid) return;
        const payload = {
            sellerId: sid, // UUID attendu par le backend
            title: (fd.get("title") || "").trim(),
            description: (fd.get("description") || "").trim(),
            price: Number(fd.get("price")),
            category: fd.get("category"),
            city: (fd.get("city") || "").trim(),
            phoneNumber: (fd.get("phoneNumber") || "").trim(),
            currency: "MAD"
        };

        if (Number.isNaN(payload.price)) {
            setMessage("error", "Champs invalides", "price doit être numérique");
            return;
        }
        if (!payload.phoneNumber) {
            setMessage("error", "Champs invalides", "téléphone requis");
            return;
        }

        try {
            const res = await fetch(API_BASE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": sid
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                await handleErrorResponse(res);
                return;
            }
            const created = await res.json();
            setMessage("success", "Produit créé", `ID ${created.id ?? "?"}`);
            form.reset();
            form.elements.currency.value = "MAD";
            // Bonus: refresh list right after creation.
            loadProducts();
        } catch (err) {
            alert("Impossible d'appeler le backend. Vérifiez que le service tourne sur le port 8085.");
            setMessage("error", "Backend injoignable", err.message);
        }
    });

    resetBtn.addEventListener("click", () => {
        form.reset();
        form.elements.currency.value = "MAD";
        setMessage("", "");
    });

    cardsContainer.addEventListener("click", async (event) => {
        if (!event.target.classList.contains("upload-btn")) return;
        const row = event.target.closest(".upload-row");
        if (!row) return;
        const fileInput = row.querySelector(".file-input");
        const file = fileInput?.files?.[0];
        const productId = row.dataset.productId;
        const sellerId = row.dataset.sellerId;

        if (!file) {
            setMessage("error", "Choisir une image avant d'uploader");
            return;
        }
        try {
            await uploadImage(productId, sellerId, file);
            setMessage("success", "Image uploadée", `Produit ${productId}`);
            fileInput.value = "";
            loadProducts();
        } catch (err) {
            alert("Impossible d'uploader l'image. Vérifiez que le backend est en route sur 8085.");
            setMessage("error", "Upload échoué", err.message);
        }
    });

    loadBtn.addEventListener("click", loadProducts);
    refreshBtn.addEventListener("click", loadProducts);
    refreshMyBtn?.addEventListener("click", loadProducts);

    // Load once on page open to quickly validate backend availability.
    loadProducts();
});
