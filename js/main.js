/* ============================================================
   孔旭个人网站 · 交互脚本
   功能：导航栏状态 / 移动端菜单 / 滚动显现 / 导航高亮 / 复制邮箱
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 导航栏：滚动后加阴影 ---------- */
  var nav = document.getElementById("nav");

  function updateNav() {
    if (window.scrollY > 20) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  /* ---------- 移动端菜单 ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // 点击菜单项后自动收起
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 滚动显现动画 ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // 旧浏览器兜底：直接显示
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- 滚动时高亮当前板块 ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var menuAnchors = navLinks.querySelectorAll("a");

  function setActiveLink(id) {
    menuAnchors.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (sec) {
      activeObserver.observe(sec);
    });
  }

  /* ---------- 复制邮箱 ---------- */
  var copyBtn = document.getElementById("copyBtn");
  var copyText = copyBtn.querySelector(".copy-btn-text");
  var copyTimer = null;

  copyBtn.addEventListener("click", function () {
    var email = copyBtn.getAttribute("data-email");

    function fallbackCopy() {
      var input = document.createElement("input");
      input.value = email;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand("copy");
      } catch (e) {
        /* 忽略，用户可手动选择邮箱复制 */
      }
      document.body.removeChild(input);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(showCopied).catch(function () {
        fallbackCopy();
        showCopied();
      });
    } else {
      fallbackCopy();
      showCopied();
    }
  });

  function showCopied() {
    copyBtn.classList.add("copied");
    copyText.textContent = "已复制 ✓";
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
      copyBtn.classList.remove("copied");
      copyText.textContent = "复制邮箱";
    }, 2000);
  }

  /* ---------- 页脚年份 ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
