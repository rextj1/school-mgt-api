/* This file is based on WebProfilerBundle/Resources/views/Profiler/base_js.html.twig.
   If you make any change in this file, verify the same change is needed in the other file. */
/* <![CDATA[ */
if (typeof Sfjs === 'undefined') {
    Sfjs = (function() {
        "use strict";

        if ('classList' in document.documentElement) {
            var hasClass = function (el, cssClass) { return el.classList.contains(cssClass); };
            var removeClass = function(el, cssClass) { el.classList.remove(cssClass); };
            var addClass = function(el, cssClass) { el.classList.add(cssClass); };
            var toggleClass = function(el, cssClass) { el.classList.toggle(cssClass); };
        } else {
            var hasClass = function (el, cssClass) { return el.className.match(new RegExp('\\b' + cssClass + '\\b')); };
            var removeClass = function(el, cssClass) { el.className = el.className.replace(new RegExp('\\b' + cssClass + '\\b'), ' '); };
            var addClass = function(el, cssClass) { if (!hasClass(el, cssClass)) { el.className += " " + cssClass; } };
            var toggleClass = function(el, cssClass) { hasClass(el, cssClass) ? removeClass(el, cssClass) : addClass(el, cssClass); };
        }

        let addEventListener;

        const el = document.createElement('div');
        if (!('addEventListener' in el)) {
            addEventListener = function (element, eventName, callback) {
                element.attachEvent('on' + eventName, callback);
            };
        } else {
            addEventListener = function (element, eventName, callback) {
                element.addEventListener(eventName, callback, false);
            };
        }

        return {
            addEventListener,

            createTabs() {
                const tabGroups = document.querySelectorAll('.sf-tabs:not([data-processed=true])');

                /* create the tab navigation for each group of tabs */
                for (var i = 0; i < tabGroups.length; i++) {
                    const tabs = tabGroups[i].querySelectorAll(':scope > .tab');
                    var tabNavigation = document.createElement('ul');
                    tabNavigation.className = 'tab-navigation';

                    let selectedTabId = 'tab-' + i + '-0'; /* select the first tab by default */
                    for (var j = 0; j < tabs.length; j++) {
                        var tabId = 'tab-' + i + '-' + j;
                        const tabTitle = tabs[j].querySelector('.tab-title').innerHTML;

                        const tabNavigationItem = document.createElement('li');
                        tabNavigationItem.setAttribute('data-tab-id', tabId);
                        if (hasClass(tabs[j], 'active')) { selectedTabId = tabId; }
                        if (hasClass(tabs[j], 'disabled')) { addClass(tabNavigationItem, 'disabled'); }
                        tabNavigationItem.innerHTML = tabTitle;
                        tabNavigation.appendChild(tabNavigationItem);

                        const tabContent = tabs[j].querySelector('.tab-content');
                        tabContent.parentElement.setAttribute('id', tabId);
                    }

                    tabGroups[i].insertBefore(tabNavigation, tabGroups[i].firstChild);
                    addClass(document.querySelector('[data-tab-id="' + selectedTabId + '"]'), 'active');
                }

                /* display the active tab and add the 'click' event listeners */
                for (i = 0; i < tabGroups.length; i++) {
                    tabNavigation = tabGroups[i].querySelectorAll(':scope >.tab-navigation li');

                    for (j = 0; j < tabNavigation.length; j++) {
                        tabId = tabNavigation[j].getAttribute('data-tab-id');
                        document.getElementById(tabId).querySelector('.tab-title').className = 'hidden';

                        if (hasClass(tabNavigation[j], 'active')) {
                            document.getElementById(tabId).className = 'block';
                        } else {
                            document.getElementById(tabId).className = 'hidden';
                        }

                        tabNavigation[j].addEventListener('click', function(e) {
                            let activeTab = e.target || e.srcElement;

                            /* needed because when the tab contains HTML contents, user can click */
                            /* on any of those elements instead of their parent '<li>' element */
                            while (activeTab.tagName.toLowerCase() !== 'li') {
                                activeTab = activeTab.parentNode;
                            }

                            /* get the full list of tabs through the parent of the active tab element */
                            const tabNavigation = activeTab.parentNode.children;
                            for (let k = 0; k < tabNavigation.length; k++) {
                                const tabId = tabNavigation[k].getAttribute('data-tab-id');
                                document.getElementById(tabId).className = 'hidden';
                                removeClass(tabNavigation[k], 'active');
                            }

                            addClass(activeTab, 'active');
                            const activeTabId = activeTab.getAttribute('data-tab-id');
                            document.getElementById(activeTabId).className = 'block';
                        });
                    }

                    tabGroups[i].setAttribute('data-processed', 'true');
                }
            },

            createToggles() {
                const toggles = document.querySelectorAll('.sf-toggle:not([data-processed=true])');

                for (let i = 0; i < toggles.length; i++) {
                    const elementSelector = toggles[i].getAttribute('data-toggle-selector');
                    const element = document.querySelector(elementSelector);

                    addClass(element, 'sf-toggle-content');

                    if (toggles[i].hasAttribute('data-toggle-initial') && toggles[i].getAttribute('data-toggle-initial') == 'display') {
                        addClass(toggles[i], 'sf-toggle-on');
                        addClass(element, 'sf-toggle-visible');
                    } else {
                        addClass(toggles[i], 'sf-toggle-off');
                        addClass(element, 'sf-toggle-hidden');
                    }

                    addEventListener(toggles[i], 'click', function(e) {
                        e.preventDefault();

                        if (window.getSelection().toString() !== '') {
                            /* Don't do anything on text selection */
                            return;
                        }

                        let toggle = e.target || e.srcElement;

                        /* needed because when the toggle contains HTML contents, user can click */
                        /* on any of those elements instead of their parent '.sf-toggle' element */
                        while (!hasClass(toggle, 'sf-toggle')) {
                            toggle = toggle.parentNode;
                        }

                        const element = document.querySelector(toggle.getAttribute('data-toggle-selector'));

                        toggleClass(toggle, 'sf-toggle-on');
                        toggleClass(toggle, 'sf-toggle-off');
                        toggleClass(element, 'sf-toggle-hidden');
                        toggleClass(element, 'sf-toggle-visible');

                        /* the toggle doesn't change its contents when clicking on it */
                        if (!toggle.hasAttribute('data-toggle-alt-content')) {
                            return;
                        }

                        if (!toggle.hasAttribute('data-toggle-original-content')) {
                            toggle.setAttribute('data-toggle-original-content', toggle.innerHTML);
                        }

                        const currentContent = toggle.innerHTML;
                        const originalContent = toggle.getAttribute('data-toggle-original-content');
                        const altContent = toggle.getAttribute('data-toggle-alt-content');
                        toggle.innerHTML = currentContent !== altContent ? altContent : originalContent;
                    });

                    /* Prevents from disallowing clicks on links inside toggles */
                    const toggleLinks = toggles[i].querySelectorAll('a');
                    for (let j = 0; j < toggleLinks.length; j++) {
                        addEventListener(toggleLinks[j], 'click', function(e) {
                            e.stopPropagation();
                        });
                    }

                    toggles[i].setAttribute('data-processed', 'true');
                }
            },

            createFilters() {
                document.querySelectorAll('[data-filters] [data-filter]').forEach(function (filter) {
                    const filters = filter.closest('[data-filters]');
                        let type = 'choice';
                        const name = filter.dataset.filter;
                        const ucName = name.charAt(0).toUpperCase()+name.slice(1);
                        const list = document.createElement('ul');
                        let values = filters.dataset['filter'+ucName] || filters.querySelectorAll('[data-filter-'+name+']');
                        let labels = {};
                        let defaults = null;
                        const indexed = {};
                        const processed = {};
                    if (typeof values === 'string') {
                        type = 'level';
                        labels = values.split(',');
                        values = values.toLowerCase().split(',');
                        defaults = values.length - 1;
                    }
                    addClass(list, 'filter-list');
                    addClass(list, 'filter-list-'+type);
                    values.forEach(function (value, i) {
                        if (value instanceof HTMLElement) {
                            value = value.dataset['filter'+ucName];
                        }
                        if (value in processed) {
                            return;
                        }
                        const option = document.createElement('li');
                            const label = i in labels ? labels[i] : value;
                            let active = false;
                            let matches;
                        if (label === '') {
                            option.innerHTML = '<em>(none)</em>';
                        } else {
                            option.innerText = label;
                        }
                        option.dataset.filter = value;
                        option.setAttribute('title', (matches = filters.querySelectorAll('[data-filter-'+name+'="'+value+'"]').length) === 1 ? 'Matches 1 row' : 'Matches '+matches+' rows');
                        indexed[value] = i;
                        list.appendChild(option);
                        addEventListener(option, 'click', function () {
                            if (type === 'choice') {
                                filters.querySelectorAll('[data-filter-'+name+']').forEach(function (row) {
                                    if (option.dataset.filter === row.dataset['filter'+ucName]) {
                                        toggleClass(row, 'filter-hidden-'+name);
                                    }
                                });
                                toggleClass(option, 'active');
                            } else if (type === 'level') {
                                if (i === this.parentNode.querySelectorAll('.active').length - 1) {
                                    return;
                                }
                                this.parentNode.querySelectorAll('li').forEach(function (currentOption, j) {
                                    if (j <= i) {
                                        addClass(currentOption, 'active');
                                        if (i === j) {
                                            addClass(currentOption, 'last-active');
                                        } else {
                                            removeClass(currentOption, 'last-active');
                                        }
                                    } else {
                                        removeClass(currentOption, 'active');
                                        removeClass(currentOption, 'last-active');
                                    }
                                });
                                filters.querySelectorAll('[data-filter-'+name+']').forEach(function (row) {
                                    if (i < indexed[row.dataset['filter'+ucName]]) {
                                        addClass(row, 'filter-hidden-'+name);
                                    } else {
                                        removeClass(row, 'filter-hidden-'+name);
                                    }
                                });
                            }
                        });
                        if (type === 'choice') {
                            active = defaults === null || defaults.includes(value);
                        } else if (type === 'level') {
                            active = i <= defaults;
                            if (active && i === defaults) {
                                addClass(option, 'last-active');
                            }
                        }
                        if (active) {
                            addClass(option, 'active');
                        } else {
                            filters.querySelectorAll('[data-filter-'+name+'="'+value+'"]').forEach(function (row) {
                                toggleClass(row, 'filter-hidden-'+name);
                            });
                        }
                        processed[value] = true;
                    });

                    if (list.childNodes.length > 1) {
                        filter.appendChild(list);
                        filter.dataset.filtered = '';
                    }
                });
            }
        };
    })();

    Sfjs.addEventListener(document, 'DOMContentLoaded', function() {
        Sfjs.createTabs();
        Sfjs.createToggles();
        Sfjs.createFilters();
    });
}
/* ]]> */
