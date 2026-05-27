const recipeElements =
  document.querySelectorAll(".recipe-template");

const recipes = Array.from(recipeElements).map(recipe => {

  return {
    title: recipe.dataset.title,

    image: recipe.dataset.image,

    tags: recipe.dataset.tags.split(","),

    description: recipe.dataset.description,

    ingredients: JSON.parse(recipe.dataset.ingredients),

    instructions: JSON.parse(recipe.dataset.instructions)
  };
});

let selectedTag = "All";

const recipeGrid = document.getElementById("recipeGrid");
const filterButtons = document.getElementById("filterButtons");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

function getAllTags() {

  const tags = recipes.flatMap(recipe => recipe.tags);

  return ["All", ...new Set(tags)];
}

function createFilterButtons() {

  const tags = getAllTags();

  filterButtons.innerHTML = "";

  tags.forEach(tag => {

    const button = document.createElement("button");

    button.className = "filter-btn";

    button.textContent = tag;

    if (tag === selectedTag) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {

      selectedTag = tag;

      document.querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));

      button.classList.add("active");

      renderRecipes();
    });

    filterButtons.appendChild(button);
  });
}

function renderRecipes() {

  const search =
    searchInput.value.toLowerCase();

  const filteredRecipes = recipes.filter(recipe => {

    const matchesSearch =
      recipe.title.toLowerCase().includes(search) ||

      recipe.tags.some(tag =>
        tag.toLowerCase().includes(search)
      );

    const matchesTag =
      selectedTag === "All" ||
      recipe.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  recipeGrid.innerHTML = "";

  if (filteredRecipes.length === 0) {

    emptyState.style.display = "block";

    return;
  }

  emptyState.style.display = "none";

  filteredRecipes.forEach(recipe => {

    const card = document.createElement("div");

    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" />

      <div class="recipe-content">

        <div class="recipe-title">
          ${recipe.title}
        </div>

        <div class="tags">
          ${recipe.tags.map(tag =>
            `<div class="tag">#${tag}</div>`
          ).join("")}
        </div>

      </div>
    `;

    card.addEventListener("click", () => {
      openRecipeModal(recipe);
    });

    recipeGrid.appendChild(card);
  });
}

function openRecipeModal(recipe) {

  const modal = document.createElement("div");

  modal.className = "modal-overlay";

  modal.innerHTML = `
    <div class="modal">

      <button class="close-btn">&times;</button>

      <img
        src="${recipe.image}"
        class="modal-banner"
        alt="${recipe.title}"
      />

      <div class="modal-content">

        <h2>${recipe.title}</h2>

        <div class="tags modal-tags">
          ${recipe.tags.map(tag =>
            `<div class="tag">#${tag}</div>`
          ).join("")}
        </div>

        <p class="description">
          ${recipe.description}
        </p>

        <h3>Ingredients</h3>

        <div class="ingredients-list">

          ${recipe.ingredients.map(item => `
            <div class="ingredient-item">
              <strong>${item.quantity}</strong>
              ${item.name}
              <span class="brand">
                (${item.brand})
              </span>
            </div>
          `).join("")}

        </div>

        <h3>Instructions</h3>

        <ol class="instructions-list">

          ${recipe.instructions.map(step => `
            <li>${step}</li>
          `).join("")}

        </ol>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".close-btn")
    .addEventListener("click", () => {
      modal.remove();
    });

  modal.addEventListener("click", (e) => {

    if (e.target === modal) {
      modal.remove();
    }
  });
}

searchInput.addEventListener("input", renderRecipes);

createFilterButtons();
renderRecipes();
