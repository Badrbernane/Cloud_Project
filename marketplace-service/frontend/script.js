// Minimal frontend to exercise the marketplace-service REST API with image upload.
const BACKEND_BASE = "http://localhost:8085";
const API_BASE = `${BACKEND_BASE}/api/market/products`;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("product-form");
    const messageEl = document.getElementById("message");
    const loadBtn = document.getElementById("load-products");
    const refreshBtn = document.getElementById("refresh-products");
    const resetBtn = document.getElementById("reset-form");
    const cardsContainer = document.getElementById("products");

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
        if (!products.length) {
            cardsContainer.innerHTML = '<div class="empty">Aucun produit pour l\'instant.</div>';
            return;
        }
        const cards = products.map((p) => {
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

    const loadProducts = async () => {
        setMessage("", "Chargement des produits...");
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) {
                await handleErrorResponse(res);
                return;
            }
            const data = await res.json();
            renderProducts(data);
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
        const payload = {
            sellerId: Number(fd.get("sellerId")),
            title: (fd.get("title") || "").trim(),
            description: (fd.get("description") || "").trim(),
            price: Number(fd.get("price")),
            category: fd.get("category"),
            city: (fd.get("city") || "").trim(),
            currency: "MAD"
        };

        if (!payload.sellerId || Number.isNaN(payload.price)) {
            setMessage("error", "Champs invalides", "sellerId et price doivent être numériques");
            return;
        }

        try {
            const res = await fetch(API_BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

    // Load once on page open to quickly validate backend availability.
    loadProducts();
});
