// UTM parameter management for apply now buttons
$(document).ready(function () {
    // Retrieve a specific cookie value by name
    function getCookieValue(name) {
        const cookiePattern = new RegExp('(^| )' + name + '=([^;]+)');
        const match = document.cookie.match(cookiePattern);
        return match ? match[2] : null;
    }

    // Function to append UTM parameters to a link
    function addUtmToLink(targets) {
        const utmParams = [];
        const utmSource = getCookieValue("utm_source");
        const utmMedium = getCookieValue("utm_medium");
        const utmCampaign = getCookieValue("utm_campaign");
        const utmTerm = getCookieValue("utm_term");
        const utmContent = getCookieValue("utm_content");

        if (utmSource) utmParams.push(`utm_source=${utmSource}`);
        if (utmMedium) utmParams.push(`utm_medium=${utmMedium}`);
        if (utmCampaign) utmParams.push(`utm_campaign=${utmCampaign}`);
        if (utmTerm) utmParams.push(`utm_term=${utmTerm}`);
        if (utmContent) utmParams.push(`utm_content=${utmContent}`);

        const fullUtmUrl = getCookieValue("full_utm_url");
        let fullQueryString = utmParams.join("&");

        if (fullUtmUrl) {
            const separator = fullQueryString ? '&' : '';
            fullQueryString += `${separator}${fullUtmUrl}`;
        }

        // Iterate over the target elements and update their href attributes
        targets.forEach(({ targetName, type }) => {
            const selector = type === "id" ? `#${targetName}` : `.${targetName}`;
            const linkElement = $(selector);

            if (linkElement.length) {
                const originalHref = linkElement.attr("href");
                const newHref = `${originalHref}?${fullQueryString}`;
                linkElement.attr("href", newHref);
            }
        });
    }




document.addEventListener("DOMContentLoaded", () => {
    const firstWrapper = document.querySelector(".first");
    const wrappers = document.querySelectorAll(".learnBelowWrapper:not(.first)");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("rounded-top");
            }
        });
    });

    wrappers.forEach(wrapper => {
        observer.observe(wrapper);
    });
});

// Utility function to check if element is in viewport
function isElementInViewport($el) {
    const rect = $el[0].getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function addClassOnScroll2() {
    const $element2 = $(".founderCXO"); // Replace with the selector of your element

    $element2.each(function () {
        if (isElementInViewport($(this))) {
            $(this).addClass("visible");
        } else {
            $(this).removeClass("visible");
        }
    });
}

function addClassOnScroll3() {
    const $element3 = $(".placementBox"); // Replace with the selector of your element

    $element3.each(function () {
        if (isElementInViewport($(this))) {
            $(".placementLeft").addClass("");
        } else {
            $(".placementLeft").removeClass("");
        }
    });
}

// Event listener to call the addClassOnScroll functions when the page is scrolled
$(window).on("scroll", addClassOnScroll2);
$(window).on("scroll", addClassOnScroll3);

// Call the function on page load to check if the element is already visible
addClassOnScroll2();

// menu scroller

$(document).ready(function () {
    const currentPath = window.location.pathname;

    const deviceWidth = window.innerWidth;
    if (deviceWidth >= 768 && deviceWidth <= 822) return;

    if (
        currentPath === "/for-companies" ||
        currentPath === "/jobs" ||
        currentPath === "/events" ||
        currentPath === "/become-a-master"
    ) return;

    var lastScrollTop = 0;
    var $menu = $("header");
    var menuHeight = $menu.height() - 60;
    var windowHeight = $(window).height();
    var sectionHeight = $(".highlightsec").height();
    var documentHeight = $(document).scrollTop();

    $(window).scroll(function () {
        var st = $(this).scrollTop();

        if ($(".highlightsec").length > 0) {
            if (st < $(".highlightsec").height()) {
                if (st > lastScrollTop) {
                    // Scrolling down
                    if (st > menuHeight && st + windowHeight < $(document).height()) {
                        $menu.css("top", -menuHeight + "px");
                        $menu.addClass("shrikIt");
                    }
                } else {
                    // Scrolling up
                    if (st <= 0) {
                        // Only remove shrikIt if at the very top
                        $menu.css("top", "0");
                        $menu.removeClass("shrikIt");
                    }
                }
                lastScrollTop = st;
            }
        } else {
            if (st > lastScrollTop) {
                // Scrolling down
                if (st > menuHeight && st + windowHeight < $(document).height()) {
                    $menu.css("top", -menuHeight + "px");
                    $menu.addClass("shrikIt");
                }
            } else {
                // Scrolling up
                if (st <= 0) {
                    $menu.css("top", "0");
                    $menu.removeClass("shrikIt");
                }
            }
            lastScrollTop = st;
        }
    });

    if (documentHeight > sectionHeight) {
        $menu.css("top", -menuHeight + "px");
        $menu.addClass("darkHeader");
    }
});

// scroll on click side MU learning Section

$(".courseName").click(function () {
    var tabID = $(this).attr("data-tab");

    $(this).addClass("active").siblings().removeClass("active");

    $("#animation-" + tabID)
        .addClass("active")
        .siblings()
        .removeClass("active");
});

// open and close popup

function openPopup(video) {
    $("#iframevideo_MU").attr(
        "src",
        `https://www.youtube-nocookie.com/embed/${video}?rel=0&autoplay=1`
    );
    $("#heroPopup").addClass("active");
    $("body").css("overflow", "hidden");
}

function closePopup() {
    $("#iframevideo_MU").attr("src", ` `);
    $("#heroPopup").removeClass("active");
    $("body").css("overflow", "visible");
}
function openPopupYtVid(video, time) {
    $("#iframevideo_MU").attr(
        "src",
        `https://www.youtube.com/embed/${video}?rel=0&autoplay=1&t=${time}s`
    );
    $("#heroPopup").addClass("active");
    $("body").css("overflow", "hidden");
}

// custom video player

$(".custom-video-area").each(function () {
    // Video
    var $video_container = $(this);
    var $video = $(this).find("#video-element");

    // Video Controls
    var $video_controls = $(this).find(".video-controls");
    var $button_controls = $(this).find(".bottom-wrapper");
    var $progress_bar = $(this).find(".progress-bar");
    var $progress = $(this).find(".time-bar");
    var $buffer_bar = $(this).find(".buffer-bar");
    var $play_button = $(this).find(".play-button");
    var $mute_button = $(this).find(".sound-button");

    var $volume_wrapper = $(this).find(".volume");
    var $volume_bar = $(this).find(".volume-bar");

    var $full_screen_btn = $(this).find(".btnFS");
    var $current = $(this).find(".current");
    var $duration = $(this).find(".duration");
    var $fast_fwd = $(this).find("#fastFwd");

    // Toggles play/pause for the video
    function playVideo() {
        if ($video[0].paused) {
            $video[0].play();
            $video_controls.addClass("playing");

            if ($video_container.parents(".video-header").length) {
                $video_container.parents(".video-header").addClass("playing");
            }
        } else {
            $video[0].pause();
            $video_controls.removeClass("playing");
            $video_container.parents(".video-header").removeClass("playing");
        }
    }

    function updateVolume(x, vol) {
        if (vol) {
            $percentage = vol * 100;
        } else {
            $position = x - $volume_wrapper.offset().left;
            $percentage = (100 * $position) / $volume_wrapper.width();
        }

        if ($percentage > 100) {
            $percentage = 100;
        }
        if ($percentage < 0) {
            $percentage = 0;
        }

        //update volume bar and video volume
        $volume_bar.css("width", $percentage + "%");
        $video[0].volume = $percentage / 100;

        if ($video[0].volume == 0) {
            $mute_button.removeClass("sound-med").addClass("sound-muted");
        } else if ($video[0].volume > 0.5) {
            $mute_button.removeClass("sound-muted").addClass("sound-med");
        } else {
            $mute_button.removeClass("sound-muted").removeClass("sound-med");
        }
    }

    function changeSpeed() {
        if ($video[0].playbackRate === 1) {
            $video[0].playbackRate = 2;
            $fast_fwd.text("2x Speed");
        } else if ($video[0].playbackRate === 2) {
            $video[0].playbackRate = 1;
            $fast_fwd.text("1x Speed");
        }
    }

    function launchFullscreen() {
        if ($video[0].requestFullscreen) {
            $video[0].requestFullscreen();
        } else if ($video[0].mozRequestFullScreen) {
            $video[0].mozRequestFullScreen();
        } else if ($video[0].webkitRequestFullscreen) {
            $video[0].webkitRequestFullscreen();
        } else if ($video[0].msRequestFullscreen) {
            $video[0].msRequestFullscreen();
        }
    }

    function time_format(seconds) {
        var m =
            Math.floor(seconds / 60) < 10
                ? "0" + Math.floor(seconds / 60)
                : Math.floor(seconds / 60);
        var s =
            Math.floor(seconds - m * 60) < 10
                ? "0" + Math.floor(seconds - m * 60)
                : Math.floor(seconds - m * 60);
        return m + ":" + s;
    }

    function startBuffer() {
        $current_buffer = $video[0].buffered.end(0);
        $max_duration = $video[0].duration;
        $perc = (100 * $current_buffer) / $max_duration;
        $buffer_bar.css("width", $perc + "%");

        if ($current_buffer < $max_duration) {
            setTimeout(startBuffer, 500);
        }
    }

    function updatebar(x) {
        $position = x - $progress.offset().left;
        $percentage = (100 * $position) / $progress_bar.width();
        if ($percentage > 100) {
            $percentage = 100;
        }
        if ($percentage < 0) {
            $percentage = 0;
        }
        $progress.css("width", $percentage + "%");
        $video[0].currentTime = ($video[0].duration * $percentage) / 100;
    }

    $video.on("loadedmetadata", function () {
        $current.text(time_format(0));
        $duration.text(time_format($video[0].duration));
        updateVolume(0, 0.7);
        setTimeout(startBuffer, 150);
    });

    // Play/pause on video click
    $video.click(function () {
        playVideo();
    });

    // Video duration timer
    $video.on("timeupdate", function () {
        $current.text(time_format($video[0].currentTime));
        $duration.text(time_format($video[0].duration));
        var currentPos = $video[0].currentTime;
        var maxduration = $video[0].duration;
        var perc = (100 * $video[0].currentTime) / $video[0].duration;
        $progress.css("width", perc + "%");
    });

    /* VIDEO CONTROLS
      ------------------------------------------------------- */

    // Hide button controls when video is playing
    $video_container.on("mouseleave", function () {
        if ($video[0].paused === false) {
            $video_container.addClass("playing");
        }
    });

    // Play/pause on button click
    $play_button.click(function () {
        playVideo();
    });

    // Fast Forward Button
    $fast_fwd.click(function () {
        changeSpeed();
    });

    // Volume Drag
    var volumeDrag = false;
    $volume_wrapper.on("mousedown", function (e) {
        volumeDrag = true;
        $video[0].muted = false;
        $mute_button.removeClass("muted");
        updateVolume(e.pageX);
    });

    $(document).on("mouseup", function (e) {
        if (volumeDrag) {
            volumeDrag = false;
            updateVolume(e.pageX);
        }
    });

    $(document).on("mousemove", function (e) {
        if (volumeDrag) {
            updateVolume(e.pageX);
        }
    });

    // Mute video on button click
    $mute_button.click(function () {
        $video[0].muted = !$video[0].muted;
        $(this).toggleClass("sound-muted");
        if ($video[0].muted) {
            $volume_bar.css("width", 0);
        } else {
            $volume_bar.css("width", $video[0].volume * 100 + "%");
        }
    });

    // Full Screen Button
    $full_screen_btn.click(function () {
        launchFullscreen();
    });

    // VIDEO PROGRESS BAR
    //when video timebar clicked
    var timeDrag = false; /* check for drag event */
    $progress_bar.on("mousedown", function (e) {
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).on("mouseup", function (e) {
        if (timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
        }
    });
    $(document).on("mousemove", function (e) {
        if (timeDrag) {
            updatebar(e.pageX);
        }
    });
});

//faq accordians

// first faq will always active

$(document).ready(function () {
    $(".cardAccordian .cardAccordianBody").not(":first").slideUp();
    $(".cardAccordian .slideUp").not(":first").slideUp();
    $(".cardAccordian:first .accordianToggler").addClass("active");
    $(".content .cardAccordian:first").addClass("active");
    $(".content .cardAccordian:first .slideUp").slideDown();
    $(".accordianToggler").click(function () {
        let id = $(this).attr("data-rel");
        $(this)
            .toggleClass("active")
            .parents(".cardAccordian")
            .siblings()
            .find(".accordianToggler")
            .removeClass("active");
        $(this).parents(".cardAccordian").find(".slideUp").slideToggle();
        $(this).parents(".cardAccordian").siblings().find(".slideUp").slideUp();
        $(this)
            .parents(".cardAccordian")
            .toggleClass("active")
            .siblings()
            .removeClass("active");
        $(`.cardAccordian #${id}`)
            .slideToggle()
            .parent()
            .siblings()
            .find(".cardAccordianBody")
            .slideUp();
    });
});

$(".submenu").click(function () {
    let id = $(this).attr("data-rel");
    $(`#${id}`).addClass("active").siblings().removeClass("active");
    $(this).addClass("active").siblings().removeClass("active");
});

$(document).ready(function () {
    $(".mobAccordian .mobAccordianBody").not(":first").slideUp();
    $(".mobAccordian:first").addClass("active");
    $(".mobAccordian:first .mobAccordianToggeler").addClass("active");
    $(".mobAccordianToggeler").click(function () {
        let id = $(this).attr("data-rel");
        $(this)
            .toggleClass("active")
            .parents(".mobAccordian")
            .siblings()
            .find(".mobAccordianToggeler")
            .removeClass("active");
        $(this)
            .parents(".mobAccordian")
            .siblings()
            .find(".mobAccordianBody")
            .slideUp();
        $(this)
            .parents(".mobAccordian")
            .toggleClass("active")
            .siblings()
            .removeClass("active");
        $(`.mobAccordian #${id}`)
            .slideToggle()
            .parent()
            .siblings()
            .find(".mobAccordianBody")
            .slideUp();
    });
});

$(document).ready(function () {
    $(".faqquestionWrap2 .faqanswer").not(":first").slideUp();
    $(".faqquestionWrap2:first .toggler").addClass("active");
    $(".faqquestionWrap2 .toggler").click(function () {
        let id = $(this).attr("data-rel");
        $(this)
            .toggleClass("active")
            .parents(".faqquestionWrap2")
            .siblings()
            .find(".toggler")
            .removeClass("active");
        $(`.faqquestionWrap2 #${id}`)
            .slideToggle()
            .parent()
            .siblings()
            .find(".faqanswer")
            .slideUp();
    });
});

function openSection(path, location) {
    window.open(path, "_self");
    localStorage.setItem("location", location);
    let section = localStorage.getItem("location");
    $(`#${section}`).addClass("active").siblings().removeClass("active");
    $(`#${section}-menu`).addClass("active").siblings().removeClass("active");
}

//faq accordians

document.addEventListener("DOMContentLoaded", function () {
    let elements = document.getElementsByTagName("lottie-player");

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("play", (event) => {
            event.target.shadowRoot.querySelector("svg").style.transform = "";
        });
        elements[i].play(); // trigger (again)
    }
});

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get("section");
    if (section) {
        if (section.startsWith("careertab")) {
            const term = section.split("careertab")[1];
            const outclassView = $(`#term${term}outclass`);
            if (outclassView.length > 0) {
                setTimeout(() => {
                    const parentOffsetTop = outclassView.offset().top;
                    const parentMarginTop = parseInt(outclassView.css("margin-top"));
                    const parentPaddingTop = parseInt(outclassView.css("padding-top"));

                    // Calculate the adjusted offset top
                    const adjustedOffsetTop =
                        parentOffsetTop - parentMarginTop - parentPaddingTop - 100;
                    $("html, body").animate(
                        {
                            scrollTop: adjustedOffsetTop,
                        },
                        800
                    );
                }, 1000);
            }
        }
        const targetElement = $(`[data-rel="${section}"]`);
        if (targetElement.length > 0) {
            targetElement.click();
            $("html, body").animate(
                {
                    scrollTop: targetElement.offset().top,
                },
                800
            );
        }
    }
    urlParams.delete("section");
    const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
});

$(".faqtabs li").click(function (event) {
    let id = $(this).attr("data-rel");
    if (id.includes("inside")) return;
    currentActiveIndex = parseInt($(this).attr("data-index"));
    $(this).addClass("active").siblings().removeClass("active");
    $(`#${id}`).addClass("active").siblings().removeClass("active");

    let scrollContainer = $(this).closest(".tabs");
    let containerLeft = scrollContainer.scrollLeft();
    let containerWidth = scrollContainer.width();
    let tabLeft = $(this).position().left;
    let tabWidth = $(this).outerWidth(true);
    let newScrollLeft =
        containerLeft + tabLeft - containerWidth / 2 + tabWidth / 2;

    scrollContainer.animate({ scrollLeft: newScrollLeft }, 150); // 0.3s smooth scroll

    if (event.target.dataset.swiper === "true") {
        const swiperID = event.target.dataset.rel;
        $(`#swipe-${swiperID}`).siblings().addClass("hide");
        $(`#swipe-${swiperID}`).removeClass("hide");
    }
});


$(document).ready(function () {
    $('a[href^="#"]').on("click", function (event) {
        if ($(this).attr("data-rel") === "external") return;
        event.preventDefault();
        var target = $(this.getAttribute("href"));

        if (target.length) {
            $("html, body").animate(
                {
                    scrollTop: target.offset().top - 76,
                },
                800
            );
        }
    });
});

// new UTM handling
// 90 days in milliseconds

var full_utm_url;

const expirationTime = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
const currentUrlOfWebsite = window.location.href;
const urlParams = new URLSearchParams(window.location.search);
const utmSource = urlParams.get("utm_source");
const utmMedium = urlParams.get("utm_medium");
const utmCampaign = urlParams.get("utm_campaign");
const utmTerm = urlParams.get("utm_term");
const utmContent = urlParams.get("utm_content");


function removeUTMs(url) {
    const utmArr = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const [baseUrl, queryString] = url.split("?");
    if (!queryString) return url;

    const queryParams = new URLSearchParams(queryString);

    utmArr.forEach(utmKey => {
        queryParams.delete(utmKey);
    });

    const updatedQueryString = queryParams.toString();
    return updatedQueryString ? `${baseUrl}?${updatedQueryString}` : baseUrl;
}

// Function to set a cookie with an expiration time
function setCookie(name, value, expiration) {
    const expirationDate = new Date(Date.now() + expiration);
    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
}

if (utmSource) setCookie("utm_source", utmSource, expirationTime);
if (utmMedium) setCookie("utm_medium", utmMedium, expirationTime);
if (utmCampaign) setCookie("utm_campaign", utmCampaign, expirationTime);
if (utmTerm) setCookie("utm_term", utmTerm, expirationTime);
if (utmContent) setCookie("utm_content", utmContent, expirationTime);

const cleanedUrl = removeUTMs(currentUrlOfWebsite);
const UTMqueryString = cleanedUrl.split('?')[1] || '';
full_utm_url = UTMqueryString;

if (UTMqueryString) setCookie("full_utm_url", UTMqueryString, expirationTime);



function getStoredUtmParam(param) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === param) {
            return cookieValue;
        }
    }
    return "";
}
function getCookieValue(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
}
function updateUrlWithUtm() {
    const storedUtmSource = getStoredUtmParam("utm_source");
    const storedUtmMedium = getStoredUtmParam("utm_medium");
    const storedUtmCampaign = getStoredUtmParam("utm_campaign");
    const storedUtmTerm = getStoredUtmParam("utm_term");
    const storedUtmContent = getStoredUtmParam("utm_content");
    const storedFullUTMUrl = getCookieValue("full_utm_url");

    const currentUrl = window.location.href;
    const newUrl = new URL(currentUrl);

    // Create a new URLSearchParams object to store final merged query parameters
    const updatedParams = new URLSearchParams(currentUrl.search);

    // Append or update UTM parameters
    if (storedUtmSource) updatedParams.set("utm_source", storedUtmSource);
    if (storedUtmMedium) updatedParams.set("utm_medium", storedUtmMedium);
    if (storedUtmCampaign) updatedParams.set("utm_campaign", storedUtmCampaign);
    if (storedUtmTerm) updatedParams.set("utm_term", storedUtmTerm);
    if (storedUtmContent) updatedParams.set("utm_content", storedUtmContent);

    // Merge additional query parameters from storedFullUTMUrl
    if (storedFullUTMUrl && storedFullUTMUrl.trim() !== '') {
        const additionalParams = new URLSearchParams(storedFullUTMUrl);
        additionalParams.forEach((value, key) => {
            updatedParams.set(key, value);
        });
    }

    // Update the URL search with the combined parameters
    newUrl.search = updatedParams.toString();

    // Update the browser URL without reloading the page
    window.history.pushState({}, "", newUrl.toString());
}
$(document).ready(function () {
    // If current page is not /events call the function
    if (window.location.pathname !== "/events") {
        updateUrlWithUtm();
    }
});


async function pushToNPF(lead) {
    const { name, email, mobile, course = "", ...otherFields } = lead;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmSource = params.utm_source || "Website";
    const utmMedium = params.utm_medium;
    const utmCampaign = params.utm_campaign;
    const utmTerm = params.utm_term;
    const utmContent = params.utm_content;
    const device = window.matchMedia("(max-width: 768px)").matches
        ? "Mobile"
        : "Desktop";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.mastersunion.org/api/leads/pushToNPF",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                field_device_type: device,
                email,
                name,
                mobile,
                linkedinProfile: "",
                medium: utmMedium,
                campaign: utmCampaign,
                source: utmSource,
                course: course,
                utmTerm: utmTerm,
                utmContent: utmContent,
                sendMail: false,
                field_utm_url: window.location.href,
                ...otherFields,
            }),
            dataType: "json",
            success: (data) => resolve(data),
            error: (xhr, status, error) => reject({ status, error }),
        });
    });
}

async function pushToNPF_PGP_TBM(lead) {
    const { name, email, mobile, course = "", ...otherFields } = lead;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmSource = params.utm_source || "Website";
    const utmMedium = params.utm_medium;
    const utmCampaign = params.utm_campaign;
    const utmTerm = params.utm_term;
    const utmContent = params.utm_content;
    const device = window.matchMedia("(max-width: 768px)").matches
        ? "Mobile"
        : "Desktop";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.mastersunion.org/api/leads/pushToNPF_PGP_TBM",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                field_device_type: device,
                email,
                name,
                mobile,
                linkedinProfile: "",
                medium: utmMedium,
                campaign: utmCampaign,
                source: utmSource,
                course: "Course",
                utmTerm: utmTerm,
                utmContent: utmContent,
                sendMail: false,
                field_utm_url: window.location.href,
                ...otherFields,
            }),
            dataType: "json",
            success: (data) => resolve(data),
            error: (xhr, status, error) => reject({ status, error }),
        });
    });
}

async function pushToNPF_UG(lead) {
    const { name, email, mobile, course = "", medium = "", ...otherFields } = lead;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmSource = params.utm_source || "Website";
    const utmMedium = params.utm_medium || medium;
    const utmCampaign = params.utm_campaign;
    const utmTerm = params.utm_term;
    const utmContent = params.utm_content;
    const device = window.matchMedia("(max-width: 768px)").matches
        ? "Mobile"
        : "Desktop";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.mastersunion.org/api/leads/pushToNPF_UG",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                field_device_type: device,
                email,
                name,
                mobile,
                linkedinProfile: "",
                medium: utmMedium,
                campaign: utmCampaign,
                source: utmSource,
                // course: course,
                utmTerm: utmTerm,
                utmContent: utmContent,
                sendMail: false,
                field_utm_url: window.location.href,
                ...otherFields,
            }),
            dataType: "json",
            success: (data) => resolve(data),
            error: (xhr, status, error) => reject({ status, error }),
        });
    });
}

async function pushToNPF_MENACheck(lead) {
    const { name, email, mobile, course = "", ...otherFields } = lead;
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const utmSource = params.utm_source || "Website";
    const utmMedium = params.utm_medium;
    const utmCampaign = params.utm_campaign;
    const utmTerm = params.utm_term;
    const utmContent = params.utm_content;
    const device = window.matchMedia("(max-width: 768px)").matches
        ? "Mobile"
        : "Desktop";
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.mastersunion.org/api/leads/${APIpushToNPFendPoint}`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                field_device_type: device,
                email,
                name,
                mobile,
                linkedinProfile: "",
                medium: utmMedium,
                campaign: utmCampaign,
                source: utmSource,
                course: course,
                utmTerm: utmTerm,
                utmContent: utmContent,
                sendMail: false,
                field_utm_url: window.location.href,
                ...otherFields
            }),
            dataType: "json",
            success: (data) => resolve(data),
            error: (xhr, status, error) => reject({ status, error }),
        });
    });
}
// Map country codes to currency codes
let APIpushToNPFendPoint = "pushToNPF";
let isCountryCodeFound = false;
$(document).ready(async function () {
    let countryCodeForMobile;

    const countryCurrencyMap = {
        IN: "INR",
        US: "USD",
        GB: "GBP",
        EU: "EUR",
        CA: "CAD",
        AU: "AUD",
        JP: "JPY",
        CN: "CNY",
        KR: "KRW",
        BR: "BRL",
        ZA: "ZAR",
        MX: "MXN",
        RU: "RUB",
        NZ: "NZD",
        SG: "SGD",
        HK: "HKD",
        SE: "SEK",
        NO: "NOK",
        DK: "DKK",
        CH: "CHF",
        IL: "ILS",
        TR: "TRY",
        AR: "ARS",
        CL: "CLP",
        CO: "COP",
        PE: "PEN",
        PH: "PHP",
        TH: "THB",
        MY: "MYR",
        ID: "IDR",
        PL: "PLN",
        CZ: "CZK",
        HU: "HUF",
        SK: "EUR",
        AT: "EUR",
        IE: "EUR",
        LU: "EUR",
        MT: "EUR",
        FI: "EUR",
        PT: "EUR",
        GR: "EUR",
        NL: "EUR",
        BE: "EUR",
        EE: "EUR",
        LV: "EUR",
        LT: "EUR",
        CY: "EUR",
        SI: "EUR",
        BG: "BGN",
        RO: "RON",
        IS: "ISK",
        HR: "HRK",
        AE: "AED",
        SA: "SAR",
        EG: "EGP",
        PK: "PKR",
        BD: "BDT",
        NG: "NGN",
        KE: "KES",
        GH: "GHS",
        VN: "VND",
        IQ: "IQD",
        IR: "IRR",
        KW: "KWD",
        OM: "OMR",
        QA: "QAR",
        BH: "BHD",
        LB: "LBP",
        JO: "JOD",
        DZ: "DZD",
        TN: "TND",
        MA: "MAD",
        MU: "MUR",
        LK: "LKR",
        NP: "NPR",
        MM: "MMK",
        UA: "UAH",
        KZ: "KZT",
        GE: "GEL",
        UZ: "UZS",
        KG: "KGS",
        MD: "MDL",
        AZ: "AZN",
        AM: "AMD",
        BY: "BYN",
        RS: "RSD",
        MK: "MKD",
        ME: "EUR",
        LY: "LYD",
        YE: "YER",
        SY: "SYP",
    };

    const countryCurrencyMapMENA_region = {
        US: "USD", // United States
        DZ: "DZD", // Algeria
        BH: "BHD", // Bahrain
        EG: "EGP", // Egypt
        IQ: "IQD", // Iraq
        JO: "JOD", // Jordan
        KW: "KWD", // Kuwait
        LY: "LYD", // Libya
        OM: "OMR", // Oman
        QA: "QAR", // Qatar
        SA: "SAR", // Saudi Arabia
        AE: "AED", // United Arab Emirates
        YE: "YER", // Yemen
        IL: "ILS", // Israel
        MA: "MAD", // Morocco
        TN: "TND", // Tunisia
        LB: "LBP", // Lebanon
        SY: "SYP", // Syria
        IR: "IRR", // Iran
    };

    async function getUserCountry() {
        try {
            // Use browser's timezone to determine country (more reliable than external APIs)
            if (Intl && Intl.DateTimeFormat) {
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                
                // Simple timezone to country mapping for common cases
                const timezoneCountryMap = {
                    "Asia/Kolkata": "IN",
                    "Asia/Calcutta": "IN",
                    "America/New_York": "US",
                    "America/Chicago": "US",
                    "America/Denver": "US",
                    "America/Los_Angeles": "US",
                    "Europe/London": "GB",
                    "Asia/Dubai": "AE",
                    "Asia/Riyadh": "SA",
                    "Asia/Kuwait": "KW",
                    "Asia/Qatar": "QA",
                    "Asia/Bahrain": "BH",
                    "Asia/Muscat": "OM"
                };
                
                const countryCode = timezoneCountryMap[userTimeZone];
                
                return countryCode || "US";
            }
            return "US";
        } catch (error) {
            console.error('Error detecting user country:', error);
            return 'US'; // Fallback to US in case of failure
        }
    }

    // Function to get the exchange rate from a conversion API
    async function getExchangeRate(baseCurrency, targetCurrency) {
        try {
            const conversionApiUrl = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
            const response = await fetch(conversionApiUrl);
            const data = await response.json();
            return data.rates[targetCurrency];
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
            return 1; // Fallback rate in case of failure
        }
    }

    // Function to convert currency based on the rate
    function convertCurrency(amount, rate) {
        return (amount * rate).toFixed(0);
    }

    // Function to format currency using Intl.NumberFormat
    function formatCurrency(amount, currencyCode, locale) {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currencyCode,
        }).format(amount);
    }

    // Function to update currency display on the page
    async function updateCurrency() {
        try {
            const userCountryCode = await getUserCountry();
            const isIndianUser = userCountryCode === "IN";
            countryCodeForMobile = userCountryCode;
            const feeData = {
                US: {
                    ApplicationRound1FeePgpRiseMENA: 59,
                    admissionFeePgpRiseMENA: 1185,
                    tuitionFeePgpRiseMENA: 48585,
                    membershipFeePgpRiseMENA: 3555,
                    totalFeePgpRiseMENA: 53325,
                },
                // BH: {
                //   ApplicationRound1FeePgpRiseMENA: 22,
                //   admissionFeePgpRiseMENA: 444,
                //   tuitionFeePgpRiseMENA: 18204,
                //   membershipFeePgpRiseMENA: 1332,
                //   totalFeePgpRiseMENA: 20002,
                // },
                // KW: {
                //   ApplicationRound1FeePgpRiseMENA: 18,
                //   admissionFeePgpRiseMENA: 363,
                //   tuitionFeePgpRiseMENA: 14883,
                //   membershipFeePgpRiseMENA: 1089,
                //   totalFeePgpRiseMENA: 16353,
                // },
                // OM: {
                //   ApplicationRound1FeePgpRiseMENA: 23,
                //   admissionFeePgpRiseMENA: 455,
                //   tuitionFeePgpRiseMENA: 18655,
                //   membershipFeePgpRiseMENA: 1365,
                //   totalFeePgpRiseMENA: 20498,
                // },
                // QA: {
                //   ApplicationRound1FeePgpRiseMENA: 211,
                //   admissionFeePgpRiseMENA: 4222,
                //   tuitionFeePgpRiseMENA: 173102,
                //   membershipFeePgpRiseMENA: 12666,
                //   totalFeePgpRiseMENA: 190201,
                // },
                // SA: {
                //   ApplicationRound1FeePgpRiseMENA: 222,
                //   admissionFeePgpRiseMENA: 4444,
                //   tuitionFeePgpRiseMENA: 182204,
                //   membershipFeePgpRiseMENA: 13332,
                //   totalFeePgpRiseMENA: 200202,
                // },
                AE: {
                    ApplicationRound1FeePgpRiseMENA: 218,
                    admissionFeePgpRiseMENA: 4351,
                    tuitionFeePgpRiseMENA: 178391,
                    membershipFeePgpRiseMENA: 13053,
                    totalFeePgpRiseMENA: 196013,
                },
            };

            const fallbackFees = {
                ApplicationRound1FeePgpRiseMENA: 59,
                admissionFeePgpRiseMENA: 1185,
                tuitionFeePgpRiseMENA: 48585,
                membershipFeePgpRiseMENA: 3555,
                totalFeePgpRiseMENA: 53325,
            };

            // Hide or update content based on country
            const UserFees = feeData[userCountryCode] || fallbackFees;

            if (isIndianUser) {
                const userCurrency =
                    countryCurrencyMapMENA_region[userCountryCode] || "USD"; // Default to USD if not found
                // Get exchange rate to convert from INR to the user's currency
                const exchangeRate = await getExchangeRate("INR", userCurrency);
                $("#round1FeePgpRiseMENA").text(
                    formatCurrency(
                        UserFees.ApplicationRound1FeePgpRiseMENA,
                        userCurrency,
                        "en-US"
                    )
                );
                $("#round2FeePgpRiseMENA").text(
                    formatCurrency(
                        UserFees.ApplicationRound1FeePgpRiseMENA,
                        userCurrency,
                        "en-US"
                    )
                );
                $("#admissionFeePgpRiseMENA").text(
                    formatCurrency(
                        UserFees.admissionFeePgpRiseMENA,
                        userCurrency,
                        "en-US"
                    )
                );
                $("#tuitionFeePgpRiseMENA").text(
                    formatCurrency(UserFees.tuitionFeePgpRiseMENA, userCurrency, "en-US")
                );
                $("#membershipFeePgpRiseMENA").text(
                    formatCurrency(
                        UserFees.membershipFeePgpRiseMENA,
                        userCurrency,
                        "en-US"
                    )
                );
                $("#totalFeePgpRiseMENA").text(
                    formatCurrency(UserFees.totalFeePgpRiseMENA, userCurrency, "en-US")
                );

                return;
            }

            // Get the user's currency or default to USD if the country is not in the map
            const userCurrency =
                countryCurrencyMapMENA_region[userCountryCode] || "USD"; // Default to USD if not found
            // Get exchange rate to convert from INR to the user's currency
            const exchangeRate = await getExchangeRate("INR", userCurrency);

            //  logic for changing for mena 18 region countries PGP Rise: General Management (Global)
            $("#round1FeePgpRiseMENA").text(
                formatCurrency(
                    UserFees.ApplicationRound1FeePgpRiseMENA,
                    userCurrency,
                    "en-US"
                )
            );
            $("#round2FeePgpRiseMENA").text(
                formatCurrency(
                    UserFees.ApplicationRound1FeePgpRiseMENA,
                    userCurrency,
                    "en-US"
                )
            );
            $("#admissionFeePgpRiseMENA").text(
                formatCurrency(UserFees.admissionFeePgpRiseMENA, userCurrency, "en-US")
            );
            $("#tuitionFeePgpRiseMENA").text(
                formatCurrency(UserFees.tuitionFeePgpRiseMENA, userCurrency, "en-US")
            );
            $("#membershipFeePgpRiseMENA").text(
                formatCurrency(UserFees.membershipFeePgpRiseMENA, userCurrency, "en-US")
            );
            $("#totalFeePgpRiseMENA").text(
                formatCurrency(UserFees.totalFeePgpRiseMENA, userCurrency, "en-US")
            );

            // --------- Conditions for outside of the country india ----------------
            APIpushToNPFendPoint = "pushToNPF_MENA";
            $(".changeAccOutsideIndia").text("January 2025");
            $(".hideFortheMENA").addClass("hide");
            $("#MENAimgChange").attr(
                "src",
                "https://cdn.mastersunion.link/assets/imgV2/InseadNew.png"
            );

            isCountryCodeFound = true;
        } catch (err) {
            console.error("Error in currency update:", err);
        }
    }

    async function getAllCountries() {
        try {
            const response = await $.ajax({
                url: "https://api.countrystatecity.in/v1/countries",
                type: "GET",
                headers: {
                    "X-CSCAPI-KEY":
                        "UVAwbkxwMDZJWVdkY25UNnhZS2ozTHdVM3FVUm5kODlsU0NDUG5mNA==",
                    Accept: "application/json",
                },
            });

            $.each(response, function (idx, country) {
                let mainPhoneCodeVal;
                if (countryCodeForMobile == country.iso2) {
                    mainPhoneCodeVal = country.phonecode;
                }

                $(".countryCodeIP")
                    .append(
                        $("<option></option>")
                            .attr("value", country.phonecode)
                            .attr("data-iso", country.iso2)
                            .text(`${country.phonecode}`)
                    )
                    .prop("selected", country.phonecode === "IN");
            });
            if (countryCodeForMobile) {
                $(".countryCodeIP option").each(function () {
                    if ($(this).attr("data-iso") === countryCodeForMobile) {
                        $(".countryCodeIP").val($(this).val());
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    }

    await updateCurrency();
    await getAllCountries();
});

function validateNameInput(elementId, errorElementId, fieldName = "Name") {
    const inputValue = $(`#${elementId}`).val().trim();
    const errorElement = $(`#${errorElementId}`);
    errorElement.addClass("warning").text(`${fieldName} cannot be empty`);
    $(errorElement).css("visibility", "hidden");
    if (inputValue === "") {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} cannot be empty`);
        return false;
    }

    if (inputValue.length < 3) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} is too short.`);
        return false;
    }

    // const namePattern = /^[A-Za-z\s]+$/;
    // if (!namePattern.test(inputValue) && fieldName !== "Message") {
    //     $(errorElement).css("visibility", "visible");
    //     errorElement
    //         .removeClass("warning")
    //         .text(`${fieldName} contains invalid characters`);
    //     return false;
    // }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}

function validateEmailInput(elementId, errorElementId) {
    const inputValue = $(`#${elementId}`).val().trim();
    const errorElement = $(`#${errorElementId}`);

    if (inputValue === "") {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Email cannot be empty");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputValue)) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Invalid email address format");
        return false;
    }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}

function validateMobileInput(elementId, errorElementId) {
    const inputValue = $(`#${elementId}`).val().trim();
    const errorElement = $(`#${errorElementId}`);

    errorElement.addClass("warning").text("Mobile number cannot be empty");
    $(errorElement).css("visibility", "hidden");

    if (inputValue === "") {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Mobile number cannot be empty");
        return false;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(inputValue)) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Mobile number must be 10 digits");
        return false;
    }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}

function validateSelectInput(selectId, errorElementId) {
    const selectElement = document.getElementById(selectId);
    const selectedIndex = selectElement.selectedIndex;
    const selectedValue = selectElement.value;
    const errorElement = $(`#${errorElementId}`);

    errorElement.addClass("warning").text("Please select an option");
    $(errorElement).css("visibility", "hidden");

    if (selectedIndex === 0 || !selectedValue) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text("Please select an option");
        return false;
    }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}

function validateGradeInput(elementId, errorElementId, fieldName = "Grade/Year") {
    const inputValue = $(`#${elementId}`).val().trim();
    const errorElement = $(`#${errorElementId}`);
    errorElement.addClass("warning").text(`${fieldName} cannot be empty`);
    $(errorElement).css("visibility", "hidden");

    if (inputValue === "") {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} cannot be empty`);
        return false;
    }

    if (inputValue.length < 1 || inputValue.length > 30) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} must be between 1 and 30 characters`);
        return false;
    }

    // Accepts alphanumeric like "10", "Year 2", "Grade 11", "1st Year", etc.
    const gradePattern = /^[A-Za-z0-9\s\-]+$/;
    if (!gradePattern.test(inputValue)) {
        $(errorElement).css("visibility", "visible");
        errorElement.removeClass("warning").text(`${fieldName} contains invalid characters`);
        return false;
    }

    errorElement.removeClass("warning").text("");
    $(errorElement).css("visibility", "hidden");
    return true;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const day = date.getDate();
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];

    const suffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    return `${day}${suffix(day)} ${month} | ${dayOfWeek}`;
}
});