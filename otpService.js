const twilio = require('twilio');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer'); // Pindahkan ke atas untuk efisiensi

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Fungsi untuk mengirim OTP
exports.sendOTP = async (req, res) => {
    const { username, email, phone, method } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate OTP 6 digit

    console.log(`Generated OTP: ${otp}`); // Tambahkan log OTP

    try {
        if (method === 'sms') {
            await client.messages.create({
                body: `Your OTP is ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
            });
            console.log('SMS sent successfully');
        } else if (method === 'email') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Kode OTP Anda',
                text: `OTP Anda yaitu ${otp}. Jangan berikan kode OTP ini pada siapapun! `,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        }

        // Simpan OTP ke database Firebase
        const otpData = { username, email, phone, otp, createdAt: admin.firestore.FieldValue.serverTimestamp() };
        await admin.firestore().collection('users').add(otpData);

        console.log('OTP saved to database:', otpData);
        res.status(200).json({ message: 'OTP berhasil dikirim!' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Gagal mengirim OTP' });
    }
};

// Fungsi untuk verifikasi OTP
exports.verifyOTP = async (req, res) => {
    const { phone, email, otp } = req.body;

    try {
        const snapshot = await admin.firestore().collection('users')
            .where('phone', '==', phone)
            .where('email', '==', email)
            .where('otp', '==', parseInt(otp)) // Pastikan OTP dalam bentuk integer
            .get();

        console.log('Snapshot size:', snapshot.size); // Log ukuran snapshot

        if (snapshot.empty) {
            console.log('Invalid OTP or user not found');
            return res.status(500).json({message: 'OTP salah atau pengguna tidak ditemukan' });
        }

        // Jika OTP valid, hapus data pengguna
        const deletePromises = snapshot.docs.map(doc => admin.firestore().collection('users').doc(doc.id).delete());
        await Promise.all(deletePromises);

        console.log('OTP verified and data deleted');
        res.status(200).json({ message: 'OTP berhasil diverifikasi!' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(400).json({ message: 'OTP Gagal  diverifikasi' });

    }
};
