document.addEventListener("DOMContentLoaded", function() {
    const userImages = document.querySelectorAll(".userItem");
    const chatSection = document.getElementById("chatSection");

    userImages.forEach(userImage => {
      userImage.addEventListener("click", function() {
          chatSection.style.display = "block";
      
      });
    });

  });

  $(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });


});