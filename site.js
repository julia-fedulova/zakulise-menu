(function () {
  const RECIPES = window.RECIPES || [];
  const CLASSICS = window.CLASSICS || [];
  const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

  function titled(recipe, index) {
    return ROMAN[index] + ". " + recipe.name;
  }

  function h(tag, props, kids) {
    const node = document.createElement(tag);
    if (props) {
      Object.entries(props).forEach(function (entry) {
        if (entry[1] == null) return;
        if (entry[0] === "class") node.className = entry[1];
        else node.setAttribute(entry[0], entry[1]);
      });
    }
    const list = kids == null ? [] : Array.isArray(kids) ? kids : [kids];
    list.forEach(function (kid) {
      if (kid == null) return;
      node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    });
    return node;
  }

  function recipeView(recipe, title) {
    return h("article", { class: "recipe" }, [
      h("h2", { class: "recipe-title" }, title),
      h(
        "ul",
        { class: "ings" },
        recipe.ingredients.map(function (row) {
          return h("li", null, [
            h("span", null, row[0]),
            h("span", null, row[1])
          ]);
        })
      ),
      h(
        "ol",
        null,
        recipe.steps.map(function (step) {
          return h("li", null, step);
        })
      )
    ]);
  }

  function fill(menu, recipes, titleOf, dialog, slot) {
    recipes.forEach(function (recipe, index) {
      const title = titleOf(recipe, index);
      const button = h("button", { type: "button", class: "card" }, [
        h("span", { class: "card-name" }, title),
        h("span", { class: "card-ingredients" }, recipe.composition)
      ]);
      button.addEventListener("click", function () {
        slot.replaceChildren(recipeView(recipe, title));
        dialog.showModal();
      });
      menu.append(button);
    });
  }

  function renderMenu() {
    const menu = document.getElementById("menu");
    const classics = document.getElementById("classics");
    const dialog = document.getElementById("recipe");
    const slot = document.getElementById("recipe-body");
    if (!menu || !classics || !dialog || !slot) return;

    fill(menu, RECIPES, titled, dialog, slot);
    fill(classics, CLASSICS, function (recipe) {
      return recipe.name;
    }, dialog, slot);

    document.getElementById("close").addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
  }

  function renderPrint() {
    const root = document.getElementById("sheet");
    if (!root) return;
    root.append(
      h("div", { class: "leaf" }, [
        h("p", { class: "kicker" }, "Барная карта"),
        h("h1", null, "Закулисье"),
        h(
          "ul",
          { class: "cast" },
          RECIPES.map(function (recipe, index) {
            return h("li", null, [
              h("span", { class: "role" }, titled(recipe, index)),
              h("span", { class: "dash" }, "—"),
              h("span", { class: "part" }, recipe.composition)
            ]);
          })
        ),
        h("p", { class: "foot" }, "Рецепты с пропорциями:")
      ]),
      h("aside", { class: "wing" }, [
        h("p", { class: "wing-title" }, "Классика"),
        h(
          "ul",
          { class: "credits" },
          CLASSICS.map(function (recipe) {
            return h("li", null, [
              h("strong", null, recipe.name),
              h("span", null, recipe.composition)
            ]);
          })
        )
      ])
    );
  }

  if (document.body.dataset.page === "print") renderPrint();
  else renderMenu();
})();
