import React,{useEffect,useState} from 'react';
import {
    useLocation,
    Link,
    useHistory
  } from "react-router-dom";
import {Image,Button,Breadcrumb,Col,Row,Modal,Toast} from 'react-bootstrap';
import '../Css/Details.css';
import ReactHtmlParser from 'react-html-parser';
import {getPriceVND} from '../Contain/getPriceVND';
import * as FetchAPI from '../Utils/FetchAPI';
import {link} from '../Utils/Link';
import Product from './Product';
import icon_success from '../images/success-24.png';
import setHTTP from '../Utils/setHTTP';
export default function Details (){
    let location = useLocation();
    const [tenmonan,setTenmonan] = useState('');
    const [hinhanh,setHinhanh] = useState('');
    const [mota,setMota] = useState('');
    const [gia,setGia] = useState('');
    const [iddanhmuc,setIddanhmuc] = useState('');
    const [tendanhmuc,setTendanhmuc] = useState('');
    const [dataFoodRalate, setdataFoodRalate] = useState([]);
    const [quanity,setquanity] = useState(1);
    const [status,setSatus] = useState(1);
    const [showModal, setshowModal] = useState(false);
    const [showToast, setshowToast] = useState(false);
    const history = useHistory();

    const localfoodmenu = {
        pathname:`/foodmenu/${"id="+iddanhmuc}`,
        state:{
          id:iddanhmuc,
          tendanhmuc:tendanhmuc,
        }
    }
    async function getMonan(){
        try {
            // console.log("Cách lấy id thứ 2 "+location.state.id);
            const id = window.location.pathname.split("/details/id=")[1];
            const data = {
                "IDMONAN":id,
                "SOLUONG":null
            }
            const res = await FetchAPI.postDataApi(link+"getMonAnById.php",data);
            setTenmonan(res.ten); 
            setHinhanh(res.hinhanh);
            setMota(res.mota);
            setGia(res.gia);
            setIddanhmuc(res.iddanhmuc);
            setSatus(res.status);
            getFoodRelate(res.iddanhmuc);
            getDanhmuc(res.iddanhmuc);
        } catch (error) {  
        }
       
    }
    async function getDanhmuc(id){
        try {
            const data = {
                "IDDANHMUC":id
            }
            const res = await FetchAPI.postDataApi(link+"getdanhmucByid.php",data);
            setTendanhmuc(res.tendanhmuc)  
        } catch (error) {
        } 
       
    }
    const getFoodRelate = async(id)=>{
        try {
            const data = {
                'IDDANHMUC': id
            }
            const res = await FetchAPI.postDataApi(link+"getMonAnByList.php",data);
            let index = res.findIndex(x=>x.id==window.location.pathname.split("/details/id=")[1]);
            res.splice(index,1);
            setdataFoodRalate(res);
        } catch (error) {
        }
    }
    const FoodRelate = dataFoodRalate.map((item,index)=>{
        return(
            <div style={{ padding:40,width:'100%' }}>
            <Product
                status={item.status}
                ten={item.ten}
                hinhanh={item.hinhanh}
                gia={getPriceVND(item.gia)+" đ / 1 phần"}
                id={item.id}
                hideOrder={true}
            />
            </div>   
        )
    })
    const handleCart = async()=>{
        const id = window.location.pathname.split("/details/id=")[1];
        // localStorage.removeItem('@cart');
        let arrTmp = [];
        const StringCartCurrent = await localStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        if(arrCartCurrent!==null){
        arrTmp = arrCartCurrent;
        }
        // console.log("arr cart current "+ JSON.stringify(arrCartCurrent));
    
        if(arrCartCurrent==null){
            arrTmp = [{id:id,soluong:parseInt(quanity)}]
        }else{
            //check food avalilable 
            let police = arrCartCurrent.some(x => x.id==id);
            if(police==true){
                //getPostion food current in arr
                let index = arrTmp.findIndex(x=>x.id==id);
                const currentAmount = parseInt(arrTmp[index].soluong) 
                
                //setNewAmount
                let newAmount = currentAmount+parseInt(quanity);
                console.log(typeof(currentAmount))
                //setAmount
                arrTmp[index].soluong = newAmount;
            }else{
                arrTmp = arrTmp.concat([{id:id,soluong:parseInt(quanity)}]);
            }
        }
        console.log(arrTmp);
        localStorage.setItem('@cart',JSON.stringify(arrTmp));
        setquanity(1)
        setshowModal(false)
        setshowToast(true)
    }
    useEffect(()=>{
        window.scroll(0,0);
        getMonan();
    },[location])
  
    const ModalOrder = ()=>(
        <div>
            <Modal show={showModal} onHide={()=>setshowModal(false)}>
            <Modal.Header closeButton>
            <Modal.Title>Bạn có chắc chắn đặt món ăn này !</Modal.Title>
            </Modal.Header>
            <Modal.Body>{`${tenmonan} với số lượng là ${quanity}`}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={()=>setshowModal(false)}>
                Đóng
            </Button>
            <Button variant="primary" onClick={handleCart}>
                Chắc chắn
            </Button>
            </Modal.Footer>
        </Modal>
      </div>
    )
    return(
        <div className="wrapper">
            {ModalOrder()}
            <div style={{ position:'fixed',right:50,top:80 }}>
                <Toast onClose={() => setshowToast(false)} show={showToast} delay={3000} autohide>
                <Toast.Header style={{ display:'flex',justifyContent:'space-between' }} closeButton>
                    <strong className="me-auto">Great Food</strong>
                </Toast.Header>
                <Toast.Body style={{ display:'flex',flexDirection:'row' }}>
                    <Image src={icon_success} width={60} height={60}/>
                    <div  style={{ display:'flex',flexDirection:'column',paddingLeft:10 }}>
                        <span>Bạn đã đặt món thành công!</span>
                        <span>Đi đến giỏ hàng ngay</span>
                        <div style={{ display:'flex',justifyContent:'flex-end',marginTop:10 }}>
                        <Button onClick={() =>history.push("/cart")} >Đi ngay</Button>
                        </div>
                    </div>
                </Toast.Body>
                </Toast>
            </div>
            <Breadcrumb style={{ paddingRight: 40 }}>
            <Breadcrumb.Item  >
            <Link to={"/home"}>Trang chủ</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item><Link to={"/fullfood"}>Tất cả món ăn</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to={localfoodmenu}>{tendanhmuc}</Link></Breadcrumb.Item>
            <Breadcrumb.Item active>{tenmonan}</Breadcrumb.Item>
            </Breadcrumb>

            <Col xs={11} className="wrapperDetails">
            <div>
            <span><h3>{tenmonan}</h3></span>
            </div>
            <div>
                <Image className="imgd" src={setHTTP(hinhanh)}/>
            </div>
            <div style={{ display:'flex',flexDirection:'row' }}>
                <p><b>Giá :</b> {getPriceVND(gia)+'đ / 1 phần'}</p>
            </div>
            <div style={{ display:'flex',flexDirection:'row' }}>
                <p><b>Số lượng :</b> </p> 
                <input 
                    type="number"
                    style={{width:100,height:30,marginLeft:10}}
                    value={quanity}
                    placeholder="Nhập số lượng món ăn"
                    onChange={(e)=>setquanity(e.target.value)}
                    min={1} max={20}
                />
            </div>
            <div style={{ display:'flex',flexDirection:'row',overflow:'auto' }}>
                <p><b>Mô tả:</b> {ReactHtmlParser(mota)}</p>
            </div>
            <div style={{ paddingTop:20 }}>
                {status==0?
                 <Button onClick={()=>setshowModal(true)}> Đặt món</Button>
                 :
                 <Button style={{ cursor:'not-allowed' }} disabled> Hết món</Button>
                }
               
            </div>
            </Col>


            <div style={{ marginTop:40 }}>
            <span style={{ color:'#de0b0b' }}><h5>Các món ăn liên quan</h5></span>
            <Row md={3}>
                {FoodRelate}
            </Row>
            </div>
        </div>
    )   
}