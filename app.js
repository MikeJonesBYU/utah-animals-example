// Utah Animals wireframe: builds every page from window.SITE_DATA (data.js).
// Nothing about categories, filters, or results is hard-coded here.

(function () {
  "use strict";

  var data = window.SITE_DATA || { attributes: [], animals: [] };

  // ---------- helpers ----------

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    }
    if (text != null) node.textContent = text;
    return node;
  }

  // An animal's values for an attribute, always as a list.
  function valuesOf(animal, attr) {
    var v = animal[attr.id];
    if (v == null) return [];
    return Array.isArray(v) ? v : [v];
  }

  function findValue(attr, valueId) {
    for (var i = 0; i < attr.values.length; i++) {
      if (attr.values[i][0] === valueId) return attr.values[i];
    }
    return null;
  }

  function byName(a, b) {
    return a.name.localeCompare(b.name);
  }

  // ---------- data validation (shown as a visible banner) ----------

  function validate() {
    var problems = [];
    var seen = {};
    data.animals.forEach(function (animal, i) {
      var name = animal.name || "(animal #" + (i + 1) + " has no name)";
      if (seen[name]) problems.push(name + ": listed more than once");
      seen[name] = true;

      data.attributes.forEach(function (attr) {
        var raw = animal[attr.id];
        if (raw == null) {
          problems.push(name + ": missing \"" + attr.label + "\"");
          return;
        }
        if (attr.multiple && !Array.isArray(raw)) {
          problems.push(name + ": \"" + attr.label + "\" should be a list, like [\"" + raw + "\"]");
        }
        if (!attr.multiple && Array.isArray(raw)) {
          problems.push(name + ": \"" + attr.label + "\" should be a single value, not a list");
        }
        var vals = valuesOf(animal, attr);
        if (attr.required && vals.length === 0) {
          problems.push(name + ": needs at least one \"" + attr.label + "\" value");
        }
        vals.forEach(function (v) {
          if (!findValue(attr, v)) {
            problems.push(name + ": \"" + v + "\" is not a valid \"" + attr.label + "\" value");
          }
        });
      });

      Object.keys(animal).forEach(function (key) {
        if (key === "name") return;
        var known = data.attributes.some(function (a) { return a.id === key; });
        if (!known) problems.push(name + ": unknown attribute \"" + key + "\"");
      });
    });
    return problems;
  }

  function showProblems(problems) {
    if (!problems.length) return;
    var box = el("div", { class: "problems", role: "alert" });
    box.appendChild(el("p", null, "Data problems in data.js (" + problems.length + "):"));
    var list = el("ul");
    problems.forEach(function (p) { list.appendChild(el("li", null, p)); });
    box.appendChild(list);
    var main = document.querySelector("main");
    main.insertBefore(box, main.firstChild);
  }

  // ---------- landing page ----------

  function buildHome() {
    var container = document.getElementById("schemes");
    data.attributes.filter(function (a) { return a.onHome; }).forEach(function (attr) {
      var section = el("section", { class: "scheme" });
      section.appendChild(el("h2", null, attr.label));
      var list = el("ul", { class: "category-buttons" });
      attr.values.forEach(function (value) {
        var li = el("li");
        var href = "category.html?" + encodeURIComponent(attr.id) + "=" + encodeURIComponent(value[0]);
        li.appendChild(el("a", { href: href, class: "button" }, value[1]));
        list.appendChild(li);
      });
      section.appendChild(list);
      container.appendChild(section);
    });
  }

  // ---------- category page ----------

  // Reads ?attributeId=valueId from the URL.
  function currentCategory() {
    var params = new URLSearchParams(window.location.search);
    for (var i = 0; i < data.attributes.length; i++) {
      var attr = data.attributes[i];
      if (params.has(attr.id)) {
        var value = findValue(attr, params.get(attr.id));
        if (value) return { attr: attr, value: value };
      }
    }
    return null;
  }

  function buildCategory() {
    var main = document.querySelector("main");
    var category = currentCategory();
    var crumbCurrent = document.getElementById("crumb-current");

    if (!category) {
      document.title = "Category not found | Utah Animals";
      crumbCurrent.textContent = "Not found";
      main.innerHTML = "";
      main.appendChild(el("h1", null, "Category not found"));
      var p = el("p");
      p.appendChild(document.createTextNode("Go back to "));
      p.appendChild(el("a", { href: "index.html" }, "Home"));
      p.appendChild(document.createTextNode(" and choose a category."));
      main.appendChild(p);
      return;
    }

    var label = category.value[1];
    document.title = label + " | Utah Animals";
    crumbCurrent.textContent = label;
    document.getElementById("page-title").textContent = label;

    // Every animal tagged with this category.
    var inCategory = data.animals.filter(function (animal) {
      return valuesOf(animal, category.attr).indexOf(category.value[0]) !== -1;
    }).sort(byName);

    // Filters: every filter attribute except the one this page is organized by.
    var filterAttrs = data.attributes.filter(function (a) {
      return a.asFilter && a.id !== category.attr.id;
    });

    var form = document.getElementById("filters");
    filterAttrs.forEach(function (attr) {
      var fieldset = el("fieldset");
      fieldset.appendChild(el("legend", null, attr.label));
      attr.values.forEach(function (value) {
        var id = "f-" + attr.id + "-" + value[0];
        var row = el("div", { class: "option" });
        var box = el("input", { type: "checkbox", id: id, name: attr.id, value: value[0] });
        row.appendChild(box);
        row.appendChild(el("label", { for: id }, value[1]));
        fieldset.appendChild(row);
      });
      form.appendChild(fieldset);
    });
    var clear = el("button", { type: "button", id: "clear-filters" }, "Clear filters");
    form.appendChild(clear);

    var countEl = document.getElementById("result-count");
    var grid = document.getElementById("cards");

    function render() {
      // Selected values per filter. Within a filter: match any. Across filters: match all.
      var selected = filterAttrs.map(function (attr) {
        var checked = form.querySelectorAll("input[name='" + attr.id + "']:checked");
        return {
          attr: attr,
          ids: Array.prototype.map.call(checked, function (c) { return c.value; })
        };
      }).filter(function (s) { return s.ids.length > 0; });

      var shown = inCategory.filter(function (animal) {
        return selected.every(function (s) {
          var vals = valuesOf(animal, s.attr);
          return s.ids.some(function (id) { return vals.indexOf(id) !== -1; });
        });
      });

      grid.innerHTML = "";
      shown.forEach(function (animal) {
        grid.appendChild(el("li", { class: "card" }, animal.name));
      });
      countEl.textContent = "Showing " + shown.length + " of " + inCategory.length +
        (inCategory.length === 1 ? " animal" : " animals");
    }

    form.addEventListener("change", render);
    clear.addEventListener("click", function () {
      form.querySelectorAll("input[type=checkbox]").forEach(function (c) { c.checked = false; });
      render();
    });
    render();
  }

  // ---------- start ----------

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    if (page === "home") buildHome();
    if (page === "category") buildCategory();
    showProblems(validate());
  });
})();
