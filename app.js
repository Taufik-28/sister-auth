$(document).ready(function() {
    $('#otp-form').on('submit', function(event) {
        event.preventDefault();
        const username = $('#username').val();
        const email = $('#email').val();
        const phone = $('#phone').val();
        const method = $('#method').val();
  
        $.ajax({
            url: 'http://localhost:3000/send-otp', // Ubah ini jika server tidak berjalan di localhost
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, email, phone, method }),
            success: function(response) {
                $('#send-message').text(response.message).css('color', 'green');
                $('#verify-form').show(); // Tampilkan form verifikasi
            },
            error: function(error) {
                let errorMessage = 'An error occurred'; // Pesan default
                if (error.responseJSON && error.responseJSON.message) {
                    errorMessage = error.responseJSON.message; // Ambil pesan dari server
                }
                $('#send-message').text(errorMessage);
            }
        });
    });

    $('#verify-form').on('submit', function(event) {
        event.preventDefault();
        const phone = $('#phone').val();
        const email = $('#email').val();
        const otp = $('#otp').val();

        console.log('Data yang akan dikirimkan ke server:', { phone, email, otp }); // Tambahkan log untuk memastikan data sudah benar
     
        $.ajax({
            url: 'http://localhost:3000/verify-otp', // Ubah ini jika server tidak berjalan di localhost
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ phone, email, otp }),
            success: function(response) {
                $('#verify-message').text(response.message).css('color', 'green');
                $('#verify-form').show(); // Tampilkan pesan sukses
            },
            error: function(error) {
                let errorMessage = 'An error occurred'; // Pesan default
                if (error.responseJSON && error.responseJSON.message) {
                    errorMessage = error.responseJSON.message; // Ambil pesan dari server
                }
                $('#verify-message').text(errorMessage);
            }
        });
    });
});
