import React ,{useState,useEffect}from 'react';
import {link} from '../Utils/Link';
import {Image,Row,Col,Button,Modal,Toast} from 'react-bootstrap'
import * as FetchAPI from '../Utils/FetchAPI';
import {getPriceVND} from '../Contain/getPriceVND';
import icon_success from '../images/success-24.png';
import setHTTP from '../Utils/setHTTP';
export default function Cart(){
    const [dataCart, setdataCart] = useState([]);
    const [showCartEmpty, setshowCartEmpty] = useState(false);
    const [showContent, setshowContent] = useState();
    const [total, settotal] = useState();
    const [showModalPayment, setshowModalPayment] = useState(false);
    const [showToast, setshowToast] = useState(false);
    useEffect(()=>{
        getCart()
    },[])
    const getCart = async()=>{
        let arr = [];
        const StringCartCurrent = await localStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        if(StringCartCurrent==null){
            getDataCart(arr);
        }else{
            getDataCart(arrCartCurrent);
        }
    }
    const getDataCart = async(arrCartCurrent)=>{
        let arrTmp = []; 
        if(arrCartCurrent.length==0){
            setshowContent(true);
            setshowCartEmpty(true);
            setdataCart(arrTmp);
        }else{
            for(let i=0;i<arrCartCurrent.length;i++){
                const data = {
                    "IDMONAN":arrCartCurrent[i].id,
                    "SOLUONG":arrCartCurrent[i].soluong
                }
                const res = await FetchAPI.postDataApi(link+"getMonAnById.php",data);
                arrTmp = arrTmp.concat(res); 
                if(i==arrCartCurrent.length-1){
                    console.log(arrTmp)
                    setdataCart(arrTmp);
                    handleGetTotal(arrTmp);
                }
            }
        }
    }
    const handleGetTotal = (arrTmp)=>{
        let totalTmp = 0;
        arrTmp.map(e=>{
            totalTmp+=e.gia*e.soluong;
        })
        setshowContent(true);
        settotal(totalTmp);
    }
    const handleSetQuanity = async(strquanity,id)=>{
        const quanity = parseInt(strquanity);
        const StringCartCurrent = await localStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        let index = arrCartCurrent.findIndex(x=>x.id==id);
        arrCartCurrent[index].soluong = quanity;
        await localStorage.setItem('@cart',JSON.stringify(arrCartCurrent));
        getCart();
    }
    const handleDeleteItem = async(id)=>{
        const StringCartCurrent = await localStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        let index = arrCartCurrent.findIndex(x=>x.id==id);
        arrCartCurrent.splice(index,1);
        await localStorage.setItem('@cart',JSON.stringify(arrCartCurrent));
        getCart();
    }
    const handleCheckPayment = async()=>{
        const token = await localStorage.getItem('keyToken');
        if(token==null){
            window.alert("B???n ph???i d??ng nh???p ????? thanh to??n")
        }else{
            handlePayment(token)
        }
    }
    const handlePayment = async(token)=>{
        const user = await FetchAPI.postDataApi(link+"checkToken.php",{"token":token})
        const idUser = user.id
        const StringCartCurrent = await localStorage.getItem('@cart');
        const arr = JSON.parse(StringCartCurrent);
        const data = {
            "MANGMONAN":arr,
            "STATUS":0,
            "TONGTIEN":total,
            "IDUSER":idUser
        }
        const res = await FetchAPI.postDataApi(link+"addBill.php",data);
        if(res.result=="successfully"){
            await localStorage.removeItem('@cart');
            getDataCart([]);
            setshowToast(true)
            setshowModalPayment(false)
        }else{
            setshowModalPayment(false)
        }
    }
    const ItemProduct = dataCart.map((item,index)=>{
        return(
            <div style={{ boxShadow:"2px 2px 10px #00000026",margin:"10px 0px",flexDirection:'row',display:'flex',padding:10 }}>
                <div>
                    <Image src={setHTTP(item.hinhanh)} width={150} height={120}/>
                </div>
                <div style={{ display:'flex',flexDirection:'column',marginLeft:20,justifyContent:'space-around' }}>
                    <span style={{ fontWeight:'bold' }}>{item.ten}</span>
                    <span>{getPriceVND(item.gia*item.soluong)+" ?? / 1 ph???n"}</span>
                </div>
                <div style={{ display:'flex',justifyContent:'flex-end',flex:1,alignItems:'center',paddingRight:20 }}>
                    <input 
                        type="number"
                        style={{width:100,height:30}}
                        value={item.soluong}
                        min={1} max={20}
                        onChange={(e)=>handleSetQuanity(e.target.value,item.id)}
                    />
                    <Button variant="danger" style={{ marginLeft:10 }} onClick={()=>handleDeleteItem(item.id)}>
                        X??a
                    </Button>
                </div>
            </div>
        )
    })
    const Summary = ()=>(
        <div>
            <div style={{ paddingBottom:20 }}>
                <span>T???ng ti???n </span>
                <b>{getPriceVND(total)+" ??"}</b>
            </div>
            <Button onClick={()=>setshowModalPayment(true)}>Thanh to??n ngay</Button>
        </div>

    )
    const ModalPayment = ()=>(
        <div>
        <Modal show={showModalPayment} onHide={()=>setshowModalPayment(false)}>
        <Modal.Header closeButton>
        <Modal.Title>B???n ch???c ch???n mu???n thanh to??n !</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`H??a ????n v???i t???ng ti???n l?? ${getPriceVND(total)} ??`}</Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={()=>setshowModalPayment(false)}>
            ????ng
        </Button>
        <Button variant="primary" onClick={handleCheckPayment}>
            Ch???c ch???n
        </Button>
        </Modal.Footer>
    </Modal>
  </div>
    )
    return(
        <div style={{ minHeight:500 }}>
            {showContent && 
                <div>
                    <div style={{ position:'fixed',right:50,top:80 }}>
                            <Toast onClose={() => setshowToast(false)} show={showToast} delay={3000} autohide>
                            <Toast.Header style={{ display:'flex',justifyContent:'space-between' }} closeButton>
                                <strong className="me-auto">Great Food</strong>
                            </Toast.Header>
                            <Toast.Body style={{ display:'flex',flexDirection:'row' }}>
                                <Image src={icon_success} width={60} height={60}/>
                                <div  style={{ display:'flex',flexDirection:'column',paddingLeft:10 }}>
                                    <span>C???m ??n b???n ???? thanh to??n!</span>
                                    <span>????n h??ng c???a b???n ???? ???????c ghi nh???n</span>
                                   
                                </div>
                            </Toast.Body>
                            </Toast>
                    </div>
                    {showCartEmpty ? 
                    <div style={{ display:'flex',flex:1,justifyContent:'center',alignItems:'center',height:500 }}>
                        Gi??? h??ng c???a b???n ??ang tr???ng....
                    </div>
                    :
                    <div>
                        {ModalPayment()}
                        <Row style={{ margin:0 }}>
                            <Col xl={6} lg={6} md={6} xs={12} style={{ padding:20 }}>
                                {ItemProduct}
                            </Col>
                            <Col xl={6} lg={6} md={6} xs={12} style={{ padding:20}}>
                                {Summary()}
                            </Col>
                        </Row>
                    </div>
                    }
                </div>
            }
        </div>            
    )
}