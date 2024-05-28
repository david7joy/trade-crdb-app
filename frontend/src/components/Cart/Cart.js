import React from 'react';
import './cart.css';

function Cart({ data, selectedStock, currentPrice, onStockChange }) {
  

  return (
    <div className='cart-container'>
        <div className='title'>Buy {selectedStock}</div>
            <form className='form-group'>
                <div className='label-box'>
                    <label className="label" for="order-type">Stock</label>
                        <select className="select" id="order-type" name="order-type" value={selectedStock} onChange={onStockChange}>
                            {data.map((item,index) => (
                                <option key={index} value={item.symbol}>{item.symbol}</option>
                            ))}
                        </select>
                </div>
                <div className='label-box'>
                    <label className="label" for="order-type">Order Type</label>
                        <select className="select" id="order-type" name="order-type">
                            <option value="buy">BUY</option>
                            <option value="sell">SELL</option>
                        </select>
                </div>
                <div className='label-box'>
                    <label className="label" for="order-type">Shares</label>
                    <input className="input"/>
                </div>
                <div className='bottom-box'>
                    <label className="label" for="order-type">Market Price</label>
                    <div className="label">{currentPrice}</div>
                </div>
                <div className='est-box'>
                    <label className="label" for="order-type">Estimated Cost</label>
                </div>
                <div className='button-box'>
                    <button className='button submit-label'>Submit Order</button>
                </div>
            </form>
     </div>
  );
}

export default Cart;
