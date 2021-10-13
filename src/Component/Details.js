import React,{useEffect,useState} from 'react';
import {
    useLocation,
    Link,
  } from "react-router-dom";
import {Image,Button,Breadcrumb,Col,Row} from 'react-bootstrap';
import '../Css/Details.css';
import ReactHtmlParser from 'react-html-parser';
import {getPriceVND} from '../Contain/getPriceVND';
import * as FetchAPI from '../Utils/FetchAPI';
import {link} from '../Utils/Link';
import Product from './Product';
export default function Details (){
    let location = useLocation();
    const [tenmonan,setTenmonan] = useState('');
    const [hinhanh,setHinhanh] = useState('');
    const [mota,setMota] = useState('');
    const [gia,setGia] = useState('');
    const [iddanhmuc,setIddanhmuc] = useState('');
    const [tendanhmuc,setTendanhmuc] = useState('');
    const [dataFoodRalate, setdataFoodRalate] = useState([]);
    const [soluong,setSoluong] = useState(1);
    const [status,setSatus] = useState(1);
  

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
            />
            </div>   
        )
    })
    useEffect(()=>{
        window.scroll(0,0);
        getMonan();
        
    },[])
    return(
        <div className="wrapper">
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
                <Image className="imgd" src={hinhanh}/>
            </div>
            <div style={{ display:'flex',flexDirection:'row' }}>
                <p><b>Giá :</b> {getPriceVND(gia)+'đ / 1 phần'}</p>
            </div>
            <div style={{ display:'flex',flexDirection:'row' }}>
                <p><b>Số lượng :</b> {soluong}</p>
            </div>
            <div style={{ display:'flex',flexDirection:'row',overflow:'auto' }}>
                <p><b>Mô tả:</b> {ReactHtmlParser(mota)}</p>
            </div>
            <div style={{ paddingTop:20 }}>
                {status==0?
                 <Button> Đặt món</Button>
                 :
                 <Button style={{ cursor:'not-allowed' }} disabled> Đặt món</Button>
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