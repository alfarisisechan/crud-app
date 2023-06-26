import { Button, Container, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api-product';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [namabarang, setNamaBarang] = useState('');
    const [hargabeli, setHargaBeli] = useState('');
    const [hargajual, setHargaJual] = useState('');
    const [fotobarang, setFotoBarang] = useState('');
    const [stok, setStok] = useState('');
    const [file, setFile] = useState(null);
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMsg2, setErrorMsg2] = useState("");
    const [selectedFile, setSelectedFile] = useState("");


    useEffect(() => {
        if(id) {
            api.get('/products/' + id).then((res) => {
                const {data} = res;
                setNamaBarang(data.namabarang);
                setHargaBeli(data.hargabeli);
                setHargaJual(data.hargajual);
                setFotoBarang(data.fotobarang);
                setStok(data.stok);
            })
        } 
    }, [id]);
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const allowedTypes = ["image/jpg", "image/png"];
        if (!allowedTypes.includes(selectedFile?.type)) {
            setIsError(true)
            setErrorMsg("Upload file dengan format jpg/png.");
            return;
        }
        if (event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
        const MAX_FILE_SIZE = 100
        const fileSizeKiloBytes = selectedFile.size / 1024
        if (fileSizeKiloBytes > MAX_FILE_SIZE) {
            setErrorMsg2("Upload file max 100kb");
            return;
        }
        setFotoBarang(event.target.files[0].name);
        setIsError(false)
        setFile(selectedFile);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isError) return
        setErrorMsg("");
        if (!file) {
            setIsError(true)
            setErrorMsg("Please select a file.");
            return;
        }
        setIsError(false);
        const product = { namabarang, hargabeli, hargajual, fotobarang, stok };
        if(id) {
            updateProduct(product)
        }
    }
    const updateProduct = (product) => {
        api.put('/products/' + id, product).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Barang berhasil diubah',
                showConfirmButton: false,
                timer: 1500
              })
            navigate(-1);
        })
    }
    return (
        <Container className='mt-5'>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nama Barang</Form.Label>
                    <Form.Control value={namabarang} type="text" placeholder="Nama Barang" onChange={(e) => setNamaBarang(e.target.value)} required/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Harga Beli</Form.Label>
                    <Form.Control value={hargabeli} type="number" placeholder="Harga Beli" onChange={(e) => setHargaBeli(e.target.value)} required/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Harga Jual</Form.Label>
                    <Form.Control value={hargajual} type="number" placeholder="Nama Jual" onChange={(e) => setHargaJual(e.target.value)} required/>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Foto Barang</Form.Label>
                    <Form.Control type='file' onChange={handleFileChange} required />
                            {isError && <div className="error-text">{errorMsg}</div>}
                            {isError && <div className="error-text">{errorMsg2}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Stok</Form.Label>
                    <Form.Control value={stok} type="number" placeholder="Stok" onChange={(e) => setStok(e.target.value)} required/>
                </Form.Group>
                <div className="d-grid gap-2">
                    <Button type='submit' variant='success'>Ubah Barang</Button>
                </div>
            </Form>
        </Container>
    );
}

export default Update;