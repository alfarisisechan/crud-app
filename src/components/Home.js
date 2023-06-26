import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api/api-product';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Home = () => {
    const [namabarang, setNamaBarang] = useState('');
    const [hargabeli, setHargaBeli] = useState('');
    const [hargajual, setHargaJual] = useState('');
    const [fotobarang, setFotoBarang] = useState('');
    const [stok, setStok] = useState('');
    const [products, setProducts] = useState();
    const [file, setFile] = useState(null);
    const [isError, setIsError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMsg2, setErrorMsg2] = useState("");
    const [selectedFile, setSelectedFile] = useState("");
    const [deleteId, setDeleteId] = useState('');

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);


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


    const addProduct = (e) => {
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
            api.post('/products', product).then((res) => {
                setShow(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Barang berhasil ditambahkan',
                    showConfirmButton: false,
                    timer: 1500
                  })
            });
    }
    const getProduct = () => {
        api.get('/products').then(res => {
            setProducts(res.data);
        })
    }
    const deleteProduct = (id) => {
        api.delete('/products/' + id).then(() => {
            setShow2(false);
            Swal.fire({
                icon: 'success',
                title: 'Barang berhasil dihapus',
                showConfirmButton: false,
                timer: 1500
              })
        })
    }
    const clickDelete = (id) => {
        setDeleteId(id);
        setShow2(true);
    }
    useEffect(() => {
        getProduct();
    }, [products]);
    return (
        <Container className='mt-5'>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={handleShow}>
                    Tambah Barang
                </Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Barang</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={addProduct}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Barang</Form.Label>
                            <Form.Control value={namabarang} type="text" placeholder="Nama Barang" onChange={(e) => setNamaBarang(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Harga Beli</Form.Label>
                            <Form.Control value={hargabeli} type="number" placeholder="Harga Beli" onChange={(e) => setHargaBeli(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Harga Jual</Form.Label>
                            <Form.Control value={hargajual} type="number" placeholder="Nama Jual" onChange={(e) => setHargaJual(e.target.value)} required />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Foto Barang</Form.Label>
                            <Form.Control type='file' onChange={handleFileChange} required />
                            {isError && <div className="error-text">{errorMsg}</div>}
                            {isError && <div className="error-text">{errorMsg2}</div>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stok</Form.Label>
                            <Form.Control value={stok} type="number" placeholder="Stok" onChange={(e) => setStok(e.target.value)} required />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button type='submit' variant='success'>Tambah Barang</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Nama Barang</th>
                        <th>Harga Beli</th>
                        <th>Harga Jual</th>
                        <th>Foto Barang</th>
                        <th>Stok</th>
                        <th>Ubah</th>
                        <th>Hapus</th>
                    </tr>
                </thead>
                <tbody>
                    {products && products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.namabarang}</td>
                            <td>{product.hargabeli}</td>
                            <td>{product.hargajual}</td>
                            <td>{product.fotobarang}</td>
                            <td>{product.stok}</td>
                            <td><Link to={'/update/' + product.id}><Button variant="primary" >Ubah</Button></Link></td>
                            <td><Button variant="danger" onClick={() => clickDelete(product.id)}>Hapus</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={show2} onHide={handleClose2}>
                <Modal.Header closeButton>
                    <Modal.Title>Hapus</Modal.Title>
                </Modal.Header>
                <Modal.Body>Apakah anda yakin ingin di hapus?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose2}>
                        Batal
                    </Button>
                    <Button variant="danger" onClick={() => deleteProduct(deleteId)} >
                        Hapus
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Home;