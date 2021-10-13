import React,{useEffect,useState} from 'react';
import {Form,FormControl,Button,Row,Pagination,Modal,Col} from 'react-bootstrap';
import ItemProductAdmin from './ItemProductAdmin';
import {getPriceVND} from '../Contain/getPriceVND';
import * as FetchAPI from '../Utils/FetchAPI';
import {link} from '../Utils/Link';

export default function ManageProduct(){ 
    let [mangmonanFull,setMangmonanFull] =  useState([]);
    let [mangmonan,setmangmonan] = useState([]);
    let [arrDetails,setarrDetails] = useState([]);
    let [itemPagination,setItemPagination] = useState([]);
    let [active,setActive] = useState(1);
    let [page,setPage] = useState(1);
    let [length,setLength] = useState();
    let [tenmonan,setTenmonan] = useState();
    let [giamonan,setGiamonan] = useState();
    const [statusRadio,setStatusRadio] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit,setShowModalEdit] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleCloseEdit = () => setShowModalEdit(false);
    const handleShowEdit = () => setShowModalEdit(true);
    const handleArr = (item) => setarrDetails(item);


    useEffect(()=>{
        getFullMonAn();
    },[])
    async function getFullMonAn(){
        try {
           const res = await FetchAPI.getDataApi(link+"getFullMonAn.php");
           setLength(Math.ceil(res.length/6));
           getMonAn(active);
           pagination(active,Math.ceil(res.length/6));
        } catch (error) {
        }
      
    }
    async function getMonAn(ac){
        try {
            const res = await FetchAPI.getDataApi(link+"getFullMonAnPage.php?trang="+ac);
            setmangmonan(res);
            setMangmonanFull(res);
        } catch (error) {
            
        }
    }
   
    const product = mangmonan.map((item,type)=>{
        return(
            <div style={{ marginTop:15,width:800 }}>
            <ItemProductAdmin
                status={item.status}
                ten={item.ten}
                hinhanh={item.hinhanh}
                gia={getPriceVND(item.gia)+" đ / 1 phần"}
                id={item.id}
                shownModal={()=>{
                    handleShow();
                    setTenmonan(item.ten);
                    setGiamonan(item.gia);
                    if(item.status == "1"){
                        setStatusRadio(false);
                    }else if(item.status == "0"){
                        setStatusRadio(true);
                    }
                }}
                setArr = {()=>handleArr(item)}
            />
            </div>
        )
    })
    function updateSearch(search){
        let newDataF = [];
        mangmonanFull.map((e)=>{
            if(e.ten.indexOf(search.target.value)!==-1){
                newDataF.push(e)
            }
        })
        setmangmonan(newDataF);
    }
    async function editFood(){
        let s = "0";
        if(statusRadio==false){
            s = "1";
        }
        else if(statusRadio==true){
            s="0";
        }
        try {
            const data = {
                "TEN":tenmonan,
                "ID":arrDetails.id,
                "GIA":giamonan,
                "STATUS":s
            }
            const res = await FetchAPI.postDataApi(link+"editFood.php",data);
            if(res.result=="successfully"){
                console.log("Thành công");
                window.location.reload();
            }
            else if (res.result=="error"){
                console.log("Thất bại")
            }
        } catch (error) {
        }
    }
    const ModalEdit = () =>{
        return(
            <Modal
                show={showModalEdit}
                onHide={handleCloseEdit}
                backdrop="static"
                keyboard={false}>
            <Modal.Header>
                <Modal.Title>Bạn chắc chắn muốn sửa món ăn này</Modal.Title>    
            </Modal.Header>        
            <Modal.Footer>
                <Button variant="primary" onClick={()=>{handleCloseEdit() ; handleShow()}}>
                    Đóng
                </Button>
                <Button variant="danger" onClick={()=>editFood()}>Chắc chắn</Button>
            </Modal.Footer>

            </Modal>
        )
    }
    const ModalItem = ()=>{
        return(
          <Modal
            show={showModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
          <Modal.Header closeButton>
            <Modal.Title>Sửa món ăn {arrDetails.ten} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
           <Row>
            <Col style={{display:'flex',alignItems:'center' }} xs={4}><b>Tên món ăn :</b></Col>
            <Col xs={8}> 
            <input 
                className="editFood"
                name="tenmonan" 
                value={tenmonan}
                onChange={e=>setTenmonan(e.target.value)}
            />
            <br/>
            </Col>
            </Row>

            <Row>
            <Col style={{display:'flex',alignItems:'center' }}  xs={4}><b>Giá : </b> </Col>
            <Col xs={8}> 
            <input 
                className="editFood"
                name="giamonan" 
                value={giamonan}
                onChange={e=>setGiamonan(e.target.value)}/>
            <br/>
            </Col>
            </Row>
            <Row>
            <Col  xs={4}><b>Trạng thái món ăn : </b> </Col>
            <Col xs={8}> 
            <Form.Group style={{ display:'flex',flexDirection:'row' }} id="formGridRadio">
                <Col xs={6}>
                <Form.Check onClick={()=>setStatusRadio(true)} style={{ width:20}} type="radio" label="Còn hàng" checked={statusRadio}/>
                </Col>
                <Col xs={6}>
                <Form.Check onClick={()=>setStatusRadio(false)} style={{ width:20 }} type="radio" label="Hết hàng"  checked={!statusRadio}/>
                </Col>
            </Form.Group>
            <br/>
            </Col>
            </Row>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Đóng
            </Button>
            <Button variant="danger" onClick={()=>{handleShowEdit();handleClose()}}>Chỉnh sửa</Button>
          </Modal.Footer>
        </Modal>
    )};
     // Xử lý phân trang
     function pagination(ac,l){
        let item = [];       
        for (let number = 1; number <= l; number++) {
        item.push(
            <Pagination.Item key={number} active={number === ac} onClick={()=>{pagination(number,l);window.scroll(0,0)}}>
            {number}
            </Pagination.Item>
        )
        }
        console.log("Độ dài của mảng" ,l);
        setPage(ac);
        getMonAn(ac);
        setItemPagination(item);
    }
    function nextPagination(){
        if(active<length){
            setActive(active+1);
            pagination(active+1,length);
            window.scroll(0,0);
        }
    }
    function prevPagination(){
        if(active>1){
            setActive(active-1);
            pagination(active-1,length);
            window.scroll(0,0);
        }
    }
    // Xử lý phân trang
    return(
        <div style={{ padding:20 }}>
            <Row className="justify-content-between" style={{ paddingBottom:30 }}>
           <h4> Quản lý món ăn </h4>
           <Form className="d-flex">
            <FormControl
                type="search"
                placeholder="Tìm kiếm theo tên món ăn ..."
                className="mr-2"
                aria-label="Search"
                onChange={(value)=>updateSearch(value)}
            />
            <Button style={{ width:150 }} variant="outline-danger">Tìm kiếm</Button>
            </Form>
            </Row>
            <Row className="justify-content-xs-center" style={{ width:'100%' }} sm={12} xs={12} md={12} lg={2} xl={3} >
            {product}
            </Row>
            <div>
            <Pagination style={{ paddingTop:30, justifyContent:'center'}}>
            <Pagination.First onClick={()=>{setActive(1);pagination(1,length);window.scroll(0,0)}}/>
            <Pagination.Prev onClick={()=>prevPagination()}/>
            {itemPagination}
            <Pagination.Next onClick={()=>nextPagination()} />
            <Pagination.Last onClick={()=>{setActive(length);pagination(length,length);window.scroll(0,0)}} />
            </Pagination>
            </div>
            {ModalItem()}
            {ModalEdit()}
        </div>
    )
}