# Panduan Mengganti Logo

Aplikasi ini sudah mendukung penggunaan **Logo Gambar** maupun **Logo Teks**.

## Cara Menambahkan Logo Gambar

1.  Siapkan file gambar logo Anda (bisa format `.png`, `.jpg`, atau `.svg`).
2.  Beri nama file tersebut menjadi `logo.png` (sangat disarankan PNG transparan).
3.  Letakkan file `logo.png` tersebut ke dalam folder `public/` di proyek ini.
    *   Path: `identity-gen/public/logo.png`

## Cara Kerja
Website akan otomatis mendeteksi:
*   Jika Anda menaruh file `logo.png`, maka gambar logo akan muncul di pojok kiri atas Navbar.
*   Jika **TIDAK** ada logo, website akan menampilkan teks judul "Generator Card".

## Mengganti Favicon (Ikon Tab Browser)
1.  Siapkan gambar logo Anda.
2.  Ubah formatnya menjadi `.ico` (gunakan converter online "PNG to ICO").
3.  Beri nama `favicon.ico`.
4.  Timpa/Replace file `favicon.ico` yang ada di folder `public/`.

---
*Setelah menambahkan file, Anda mungkin perlu me-refresh halaman atau restart server (`npm run dev`) jika gambar tidak langsung muncul.*
