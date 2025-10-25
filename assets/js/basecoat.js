(() => {
  const componentRegistry = {};
  let observer = null;

  const registerComponent = (name, selector, initFunction) => {
    componentRegistry[name] = {
      selector,
      init: initFunction,
    };
  };

  const initComponent = (element, componentName) => {
    const component = componentRegistry[componentName];
    if (!component) return;

    try {
      component.init(element);
    } catch (error) {
      console.error(`Failed to initialize ${componentName}:`, error);
    }
  };

  const initAllComponents = () => {
    Object.entries(componentRegistry).forEach(([name, { selector, init }]) => {
      document.querySelectorAll(selector).forEach(init);
    });
  };

  const initNewComponents = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    Object.entries(componentRegistry).forEach(([name, { selector, init }]) => {
      if (node.matches(selector)) {
        init(node);
      }
      node.querySelectorAll(selector).forEach(init);
    });
  };

  const startObserver = () => {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(initNewComponents);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  const stopObserver = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const reinitComponent = (componentName) => {
    const component = componentRegistry[componentName];
    if (!component) {
      console.warn(`Component '${componentName}' not found in registry`);
      return;
    }

    // Clear initialization flag for this component
    const flag = `data-${componentName}-initialized`;
    document.querySelectorAll(`[${flag}]`).forEach((el) => {
      el.removeAttribute(flag);
    });

    document.querySelectorAll(component.selector).forEach(component.init);
  };

  const reinitAll = () => {
    // Clear all initialization flags using the registry
    Object.entries(componentRegistry).forEach(([name, { selector }]) => {
      const flag = `data-${name}-initialized`;
      document.querySelectorAll(`[${flag}]`).forEach((el) => {
        el.removeAttribute(flag);
      });
    });

    initAllComponents();
  };

  window.basecoat = {
    register: registerComponent,
    init: reinitComponent,
    initAll: reinitAll,
    start: startObserver,
    stop: stopObserver,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initAllComponents();
    startObserver();
  });
})();
(() => {
  const initDropdownMenu = (dropdownMenuComponent) => {
    const trigger = dropdownMenuComponent.querySelector(":scope > button");
    const popover = dropdownMenuComponent.querySelector(
      ":scope > [data-popover]",
    );
    const menu = popover.querySelector('[role="menu"]');

    if (!trigger || !menu || !popover) {
      const missing = [];
      if (!trigger) missing.push("trigger");
      if (!menu) missing.push("menu");
      if (!popover) missing.push("popover");
      console.error(
        `Dropdown menu initialisation failed. Missing element(s): ${missing.join(", ")}`,
        dropdownMenuComponent,
      );
      return;
    }

    let menuItems = [];
    let activeIndex = -1;

    const closePopover = (focusOnTrigger = true) => {
      if (trigger.getAttribute("aria-expanded") === "false") return;
      trigger.setAttribute("aria-expanded", "false");
      trigger.removeAttribute("aria-activedescendant");
      popover.setAttribute("aria-hidden", "true");

      if (focusOnTrigger) {
        trigger.focus();
      }

      setActiveItem(-1);
    };

    const openPopover = (initialSelection = false) => {
      document.dispatchEvent(
        new CustomEvent("basecoat:popover", {
          detail: { source: dropdownMenuComponent },
        }),
      );

      trigger.setAttribute("aria-expanded", "true");
      popover.setAttribute("aria-hidden", "false");
      menuItems = Array.from(
        menu.querySelectorAll('[role^="menuitem"]'),
      ).filter(
        (item) =>
          !item.hasAttribute("disabled") &&
          item.getAttribute("aria-disabled") !== "true",
      );

      if (menuItems.length > 0 && initialSelection) {
        if (initialSelection === "first") {
          setActiveItem(0);
        } else if (initialSelection === "last") {
          setActiveItem(menuItems.length - 1);
        }
      }
    };

    const setActiveItem = (index) => {
      if (activeIndex > -1 && menuItems[activeIndex]) {
        menuItems[activeIndex].classList.remove("active");
      }
      activeIndex = index;
      if (activeIndex > -1 && menuItems[activeIndex]) {
        const activeItem = menuItems[activeIndex];
        activeItem.classList.add("active");
        trigger.setAttribute("aria-activedescendant", activeItem.id);
      } else {
        trigger.removeAttribute("aria-activedescendant");
      }
    };

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closePopover();
      } else {
        openPopover(false);
      }
    });

    dropdownMenuComponent.addEventListener("keydown", (event) => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      if (event.key === "Escape") {
        if (isExpanded) closePopover();
        return;
      }

      if (!isExpanded) {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          openPopover(false);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          openPopover("first");
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          openPopover("last");
        }
        return;
      }

      if (menuItems.length === 0) return;

      let nextIndex = activeIndex;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          nextIndex =
            activeIndex === -1
              ? 0
              : Math.min(activeIndex + 1, menuItems.length - 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex =
            activeIndex === -1
              ? menuItems.length - 1
              : Math.max(activeIndex - 1, 0);
          break;
        case "Home":
          event.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          event.preventDefault();
          nextIndex = menuItems.length - 1;
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          menuItems[activeIndex]?.click();
          closePopover();
          return;
      }

      if (nextIndex !== activeIndex) {
        setActiveItem(nextIndex);
      }
    });

    menu.addEventListener("mousemove", (event) => {
      const menuItem = event.target.closest('[role^="menuitem"]');
      if (menuItem && menuItems.includes(menuItem)) {
        const index = menuItems.indexOf(menuItem);
        if (index !== activeIndex) {
          setActiveItem(index);
        }
      }
    });

    menu.addEventListener("mouseleave", () => {
      setActiveItem(-1);
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest('[role^="menuitem"]')) {
        closePopover();
      }
    });

    document.addEventListener("click", (event) => {
      if (!dropdownMenuComponent.contains(event.target)) {
        closePopover();
      }
    });

    document.addEventListener("basecoat:popover", (event) => {
      if (event.detail.source !== dropdownMenuComponent) {
        closePopover(false);
      }
    });

    dropdownMenuComponent.dataset.dropdownMenuInitialized = true;
    dropdownMenuComponent.dispatchEvent(
      new CustomEvent("basecoat:initialized"),
    );
  };

  if (window.basecoat) {
    window.basecoat.register(
      "dropdown-menu",
      ".dropdown-menu:not([data-dropdown-menu-initialized])",
      initDropdownMenu,
    );
  }
})();
(() => {
  const initPopover = (popoverComponent) => {
    const trigger = popoverComponent.querySelector(":scope > button");
    const content = popoverComponent.querySelector(":scope > [data-popover]");

    if (!trigger || !content) {
      const missing = [];
      if (!trigger) missing.push("trigger");
      if (!content) missing.push("content");
      console.error(
        `Popover initialisation failed. Missing element(s): ${missing.join(", ")}`,
        popoverComponent,
      );
      return;
    }

    const closePopover = (focusOnTrigger = true) => {
      if (trigger.getAttribute("aria-expanded") === "false") return;
      trigger.setAttribute("aria-expanded", "false");
      content.setAttribute("aria-hidden", "true");
      if (focusOnTrigger) {
        trigger.focus();
      }
    };

    const openPopover = () => {
      document.dispatchEvent(
        new CustomEvent("basecoat:popover", {
          detail: { source: popoverComponent },
        }),
      );

      const elementToFocus = content.querySelector("[autofocus]");
      if (elementToFocus) {
        content.addEventListener(
          "transitionend",
          () => {
            elementToFocus.focus();
          },
          { once: true },
        );
      }

      trigger.setAttribute("aria-expanded", "true");
      content.setAttribute("aria-hidden", "false");
    };

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closePopover();
      } else {
        openPopover();
      }
    });

    popoverComponent.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePopover();
      }
    });

    document.addEventListener("click", (event) => {
      if (!popoverComponent.contains(event.target)) {
        closePopover();
      }
    });

    document.addEventListener("basecoat:popover", (event) => {
      if (event.detail.source !== popoverComponent) {
        closePopover(false);
      }
    });

    popoverComponent.dataset.popoverInitialized = true;
    popoverComponent.dispatchEvent(new CustomEvent("basecoat:initialized"));
  };

  if (window.basecoat) {
    window.basecoat.register(
      "popover",
      ".popover:not([data-popover-initialized])",
      initPopover,
    );
  }
})();

(() => {
  const initSelect = (selectComponent) => {
    const trigger = selectComponent.querySelector(":scope > button");
    const selectedLabel = trigger.querySelector(":scope > span");
    const popover = selectComponent.querySelector(":scope > [data-popover]");
    const listbox = popover.querySelector('[role="listbox"]');
    const input = selectComponent.querySelector(
      ':scope > input[type="hidden"]',
    );
    const filter = selectComponent.querySelector('header input[type="text"]');
    if (!trigger || !popover || !listbox || !input) {
      const missing = [];
      if (!trigger) missing.push("trigger");
      if (!popover) missing.push("popover");
      if (!listbox) missing.push("listbox");
      if (!input) missing.push("input");
      console.error(
        `Select component initialisation failed. Missing element(s): ${missing.join(", ")}`,
        selectComponent,
      );
      return;
    }

    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    let visibleOptions = [...options];
    let activeIndex = -1;

    const setActiveOption = (index) => {
      if (activeIndex > -1 && options[activeIndex]) {
        options[activeIndex].classList.remove("active");
      }

      activeIndex = index;

      if (activeIndex > -1) {
        const activeOption = options[activeIndex];
        activeOption.classList.add("active");
        if (activeOption.id) {
          trigger.setAttribute("aria-activedescendant", activeOption.id);
        } else {
          trigger.removeAttribute("aria-activedescendant");
        }
      } else {
        trigger.removeAttribute("aria-activedescendant");
      }
    };

    const hasTransition = () => {
      const style = getComputedStyle(popover);
      return (
        parseFloat(style.transitionDuration) > 0 ||
        parseFloat(style.transitionDelay) > 0
      );
    };

    const updateValue = (option, triggerEvent = true) => {
      if (option) {
        selectedLabel.innerHTML = option.dataset.label || option.innerHTML;
        input.value = option.dataset.value;
        listbox
          .querySelector('[role="option"][aria-selected="true"]')
          ?.removeAttribute("aria-selected");
        option.setAttribute("aria-selected", "true");

        if (triggerEvent) {
          const event = new CustomEvent("change", {
            detail: { value: option.dataset.value },
            bubbles: true,
          });
          selectComponent.dispatchEvent(event);
        }
      }
    };

    const closePopover = (focusOnTrigger = true) => {
      if (popover.getAttribute("aria-hidden") === "true") return;

      if (filter) {
        const resetFilter = () => {
          filter.value = "";
          visibleOptions = [...options];
          options.forEach((opt) => opt.setAttribute("aria-hidden", "false"));
        };

        if (hasTransition()) {
          popover.addEventListener("transitionend", resetFilter, {
            once: true,
          });
        } else {
          resetFilter();
        }
      }

      if (focusOnTrigger) trigger.focus();
      popover.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      setActiveOption(-1);
    };

    const selectOption = (option) => {
      if (!option) return;

      const oldValue = input.value;
      const newValue = option.dataset.value;

      if (newValue != null && newValue !== oldValue) {
        updateValue(option);
      }

      closePopover();
    };

    const selectByValue = (value) => {
      const option = options.find((opt) => opt.dataset.value === value);
      selectOption(option);
    };

    if (filter) {
      const filterOptions = () => {
        const searchTerm = filter.value.trim().toLowerCase();

        setActiveOption(-1);

        visibleOptions = [];
        options.forEach((option) => {
          const optionText = (option.dataset.label || option.textContent)
            .trim()
            .toLowerCase();
          const matches = optionText.includes(searchTerm);
          option.setAttribute("aria-hidden", String(!matches));
          if (matches) {
            visibleOptions.push(option);
          }
        });
      };

      filter.addEventListener("input", filterOptions);
    }

    let initialOption = options.find(
      (opt) => opt.dataset.value === input.value,
    );

    if (!initialOption) {
      initialOption =
        options.find((opt) => opt.dataset.value !== undefined) ?? options[0];
    }

    updateValue(initialOption, false);

    const handleKeyNavigation = (event) => {
      const isPopoverOpen = popover.getAttribute("aria-hidden") === "false";

      if (
        !["ArrowDown", "ArrowUp", "Enter", "Home", "End", "Escape"].includes(
          event.key,
        )
      ) {
        return;
      }

      if (!isPopoverOpen) {
        if (event.key !== "Enter" && event.key !== "Escape") {
          event.preventDefault();
          trigger.click();
        }
        return;
      }

      event.preventDefault();

      if (event.key === "Escape") {
        closePopover();
        return;
      }

      if (event.key === "Enter") {
        if (activeIndex > -1) {
          selectOption(options[activeIndex]);
        }
        return;
      }

      if (visibleOptions.length === 0) return;

      const currentVisibleIndex =
        activeIndex > -1 ? visibleOptions.indexOf(options[activeIndex]) : -1;
      let nextVisibleIndex = currentVisibleIndex;

      switch (event.key) {
        case "ArrowDown":
          if (currentVisibleIndex < visibleOptions.length - 1) {
            nextVisibleIndex = currentVisibleIndex + 1;
          }
          break;
        case "ArrowUp":
          if (currentVisibleIndex > 0) {
            nextVisibleIndex = currentVisibleIndex - 1;
          } else if (currentVisibleIndex === -1) {
            nextVisibleIndex = 0;
          }
          break;
        case "Home":
          nextVisibleIndex = 0;
          break;
        case "End":
          nextVisibleIndex = visibleOptions.length - 1;
          break;
      }

      if (nextVisibleIndex !== currentVisibleIndex) {
        const newActiveOption = visibleOptions[nextVisibleIndex];
        setActiveOption(options.indexOf(newActiveOption));
        newActiveOption.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    };

    listbox.addEventListener("mousemove", (event) => {
      const option = event.target.closest('[role="option"]');
      if (option && visibleOptions.includes(option)) {
        const index = options.indexOf(option);
        if (index !== activeIndex) {
          setActiveOption(index);
        }
      }
    });

    listbox.addEventListener("mouseleave", () => {
      const selectedOption = listbox.querySelector(
        '[role="option"][aria-selected="true"]',
      );
      if (selectedOption) {
        setActiveOption(options.indexOf(selectedOption));
      } else {
        setActiveOption(-1);
      }
    });

    trigger.addEventListener("keydown", handleKeyNavigation);
    if (filter) {
      filter.addEventListener("keydown", handleKeyNavigation);
    }

    const openPopover = () => {
      document.dispatchEvent(
        new CustomEvent("basecoat:popover", {
          detail: { source: selectComponent },
        }),
      );

      if (filter) {
        if (hasTransition()) {
          popover.addEventListener(
            "transitionend",
            () => {
              filter.focus();
            },
            { once: true },
          );
        } else {
          filter.focus();
        }
      }

      popover.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");

      const selectedOption = listbox.querySelector(
        '[role="option"][aria-selected="true"]',
      );
      if (selectedOption) {
        setActiveOption(options.indexOf(selectedOption));
        selectedOption.scrollIntoView({ block: "nearest" });
      }
    };

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closePopover();
      } else {
        openPopover();
      }
    });

    listbox.addEventListener("click", (event) => {
      const clickedOption = event.target.closest('[role="option"]');
      if (clickedOption) {
        selectOption(clickedOption);
      }
    });

    document.addEventListener("click", (event) => {
      if (!selectComponent.contains(event.target)) {
        closePopover(false);
      }
    });

    document.addEventListener("basecoat:popover", (event) => {
      if (event.detail.source !== selectComponent) {
        closePopover(false);
      }
    });

    popover.setAttribute("aria-hidden", "true");

    selectComponent.selectByValue = selectByValue;
    selectComponent.dataset.selectInitialized = true;
    selectComponent.dispatchEvent(new CustomEvent("basecoat:initialized"));
  };

  if (window.basecoat) {
    window.basecoat.register(
      "select",
      "div.select:not([data-select-initialized])",
      initSelect,
    );
  }
})();
(() => {
  // Monkey patching the history API to detect client-side navigation
  if (!window.history.__basecoatPatched) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event("basecoat:locationchange"));
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event("basecoat:locationchange"));
    };

    window.history.__basecoatPatched = true;
  }

  const initSidebar = (sidebarComponent) => {
    const initialOpen = sidebarComponent.dataset.initialOpen !== "false";
    const initialMobileOpen =
      sidebarComponent.dataset.initialMobileOpen === "true";
    const breakpoint = parseInt(sidebarComponent.dataset.breakpoint) || 768;

    let open =
      breakpoint > 0
        ? window.innerWidth >= breakpoint
          ? initialOpen
          : initialMobileOpen
        : initialOpen;

    const updateCurrentPageLinks = () => {
      const currentPath = window.location.pathname.replace(/\/$/, "");
      sidebarComponent.querySelectorAll("a").forEach((link) => {
        if (link.hasAttribute("data-ignore-current")) return;

        const linkPath = new URL(link.href).pathname.replace(/\/$/, "");
        if (linkPath === currentPath) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const updateState = () => {
      sidebarComponent.setAttribute("aria-hidden", !open);
      if (open) {
        sidebarComponent.removeAttribute("inert");
      } else {
        sidebarComponent.setAttribute("inert", "");
      }
    };

    const setState = (state) => {
      open = state;
      updateState();
    };

    const sidebarId = sidebarComponent.id;

    document.addEventListener("basecoat:sidebar", (event) => {
      if (event.detail?.id && event.detail.id !== sidebarId) return;

      switch (event.detail?.action) {
        case "open":
          setState(true);
          break;
        case "close":
          setState(false);
          break;
        default:
          setState(!open);
          break;
      }
    });

    sidebarComponent.addEventListener("click", (event) => {
      const target = event.target;
      const nav = sidebarComponent.querySelector("nav");

      const isMobile = window.innerWidth < breakpoint;

      if (
        isMobile &&
        target.closest("a, button") &&
        !target.closest("[data-keep-mobile-sidebar-open]")
      ) {
        if (document.activeElement) document.activeElement.blur();
        setState(false);
        return;
      }

      if (target === sidebarComponent || (nav && !nav.contains(target))) {
        if (document.activeElement) document.activeElement.blur();
        setState(false);
      }
    });

    window.addEventListener("popstate", updateCurrentPageLinks);
    window.addEventListener("basecoat:locationchange", updateCurrentPageLinks);

    updateState();
    updateCurrentPageLinks();
    sidebarComponent.dataset.sidebarInitialized = true;
    sidebarComponent.dispatchEvent(new CustomEvent("basecoat:initialized"));
  };

  if (window.basecoat) {
    window.basecoat.register(
      "sidebar",
      ".sidebar:not([data-sidebar-initialized])",
      initSidebar,
    );
  }
})();
(() => {
  const initTabs = (tabsComponent) => {
    const tablist = tabsComponent.querySelector('[role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs
      .map((tab) => document.getElementById(tab.getAttribute("aria-controls")))
      .filter(Boolean);

    const selectTab = (tabToSelect) => {
      tabs.forEach((tab, index) => {
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
        if (panels[index]) panels[index].hidden = true;
      });

      tabToSelect.setAttribute("aria-selected", "true");
      tabToSelect.setAttribute("tabindex", "0");
      const activePanel = document.getElementById(
        tabToSelect.getAttribute("aria-controls"),
      );
      if (activePanel) activePanel.hidden = false;
    };

    tablist.addEventListener("click", (event) => {
      const clickedTab = event.target.closest('[role="tab"]');
      if (clickedTab) selectTab(clickedTab);
    });

    tablist.addEventListener("keydown", (event) => {
      const currentTab = event.target;
      if (!tabs.includes(currentTab)) return;

      let nextTab;
      const currentIndex = tabs.indexOf(currentTab);

      switch (event.key) {
        case "ArrowRight":
          nextTab = tabs[(currentIndex + 1) % tabs.length];
          break;
        case "ArrowLeft":
          nextTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
          break;
        case "Home":
          nextTab = tabs[0];
          break;
        case "End":
          nextTab = tabs[tabs.length - 1];
          break;
        default:
          return;
      }

      event.preventDefault();
      selectTab(nextTab);
      nextTab.focus();
    });

    tabsComponent.dataset.tabsInitialized = true;
    tabsComponent.dispatchEvent(new CustomEvent("basecoat:initialized"));
  };

  if (window.basecoat) {
    window.basecoat.register(
      "tabs",
      ".tabs:not([data-tabs-initialized])",
      initTabs,
    );
  }
})();
(() => {
  let toaster;
  const toasts = new WeakMap();
  let isPaused = false;
  const ICONS = {
    success:
      '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    error:
      '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
    info: '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    warning:
      '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  };

  function initToaster(toasterElement) {
    if (toasterElement.dataset.toasterInitialized) return;
    toaster = toasterElement;

    toaster.addEventListener("mouseenter", pauseAllTimeouts);
    toaster.addEventListener("mouseleave", resumeAllTimeouts);
    toaster.addEventListener("click", (event) => {
      const actionLink = event.target.closest(".toast footer a");
      const actionButton = event.target.closest(".toast footer button");
      if (actionLink || actionButton) {
        closeToast(event.target.closest(".toast"));
      }
    });

    toaster
      .querySelectorAll(".toast:not([data-toast-initialized])")
      .forEach(initToast);
    toaster.dataset.toasterInitialized = "true";
    toaster.dispatchEvent(new CustomEvent("basecoat:initialized"));
  }

  function initToast(element) {
    if (element.dataset.toastInitialized) return;

    const duration = parseInt(element.dataset.duration);
    const timeoutDuration =
      duration !== -1
        ? duration || (element.dataset.category === "error" ? 5000 : 3000)
        : -1;

    const state = {
      remainingTime: timeoutDuration,
      timeoutId: null,
      startTime: null,
    };

    if (timeoutDuration !== -1) {
      if (isPaused) {
        state.timeoutId = null;
      } else {
        state.startTime = Date.now();
        state.timeoutId = setTimeout(
          () => closeToast(element),
          timeoutDuration,
        );
      }
    }
    toasts.set(element, state);

    element.dataset.toastInitialized = "true";
  }

  function pauseAllTimeouts() {
    if (isPaused) return;

    isPaused = true;

    toaster
      .querySelectorAll('.toast:not([aria-hidden="true"])')
      .forEach((element) => {
        if (!toasts.has(element)) return;

        const state = toasts.get(element);
        if (state.timeoutId) {
          clearTimeout(state.timeoutId);
          state.timeoutId = null;
          state.remainingTime -= Date.now() - state.startTime;
        }
      });
  }

  function resumeAllTimeouts() {
    if (!isPaused) return;

    isPaused = false;

    toaster
      .querySelectorAll('.toast:not([aria-hidden="true"])')
      .forEach((element) => {
        if (!toasts.has(element)) return;

        const state = toasts.get(element);
        if (state.remainingTime !== -1 && !state.timeoutId) {
          if (state.remainingTime > 0) {
            state.startTime = Date.now();
            state.timeoutId = setTimeout(
              () => closeToast(element),
              state.remainingTime,
            );
          } else {
            closeToast(element);
          }
        }
      });
  }

  function closeToast(element) {
    if (!toasts.has(element)) return;

    const state = toasts.get(element);
    clearTimeout(state.timeoutId);
    toasts.delete(element);

    if (element.contains(document.activeElement)) document.activeElement.blur();
    element.setAttribute("aria-hidden", "true");
    element.addEventListener("transitionend", () => element.remove(), {
      once: true,
    });
  }

  function executeAction(button, toast) {
    const actionString = button.dataset.toastAction;
    if (!actionString) return;
    try {
      const func = new Function("close", actionString);
      func(() => closeToast(toast));
    } catch (event) {
      console.error("Error executing toast action:", event);
    }
  }

  function createToast(config) {
    const {
      category = "info",
      title,
      description,
      action,
      cancel,
      duration,
      icon,
    } = config;

    const iconHtml = icon || (category && ICONS[category]) || "";
    const titleHtml = title ? `<h2>${title}</h2>` : "";
    const descriptionHtml = description ? `<p>${description}</p>` : "";
    const actionHtml = action?.href
      ? `<a href="${action.href}" class="btn" data-toast-action>${action.label}</a>`
      : action?.onclick
        ? `<button type="button" class="btn" data-toast-action onclick="${action.onclick}">${action.label}</button>`
        : "";
    const cancelHtml = cancel
      ? `<button type="button" class="btn-outline h-6 text-xs px-2.5 rounded-sm" data-toast-cancel onclick="${cancel?.onclick}">${cancel.label}</button>`
      : "";

    const footerHtml =
      actionHtml || cancelHtml
        ? `<footer>${actionHtml}${cancelHtml}</footer>`
        : "";

    const html = `
      <div
        class="toast"
        role="${category === "error" ? "alert" : "status"}"
        aria-atomic="true"
        ${category ? `data-category="${category}"` : ""}
        ${duration !== undefined ? `data-duration="${duration}"` : ""}
      >
        <div class="toast-content">
          ${iconHtml}
          <section>
            ${titleHtml}
            ${descriptionHtml}
          </section>
          ${footerHtml}
          </div>
        </div>
      </div>
    `;
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  document.addEventListener("basecoat:toast", (event) => {
    if (!toaster) {
      console.error(
        "Cannot create toast: toaster container not found on page.",
      );
      return;
    }
    const config = event.detail?.config || {};
    const toastElement = createToast(config);
    toaster.appendChild(toastElement);
  });

  if (window.basecoat) {
    window.basecoat.register(
      "toaster",
      "#toaster:not([data-toaster-initialized])",
      initToaster,
    );
    window.basecoat.register(
      "toast",
      ".toast:not([data-toast-initialized])",
      initToast,
    );
  }
})();
