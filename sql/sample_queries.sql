/* check forgein key constrain works */
select * from users where user_id = (select user_id from accounts where account_id='fff4c54a-df6e-452f-8940-f9d76ecf7c56');  

/* get username if you know account_nbr */
select username,email from users where user_id = (select user_id from accounts where account_nbr='3764508619'); 

/* get account balance from order_number */
select account_nbr,user_id,balance from accounts where account_nbr = (select account_nbr from orders where order_nbr='9209T4BAUZCSEX'); 

/* get ticker info from order activity */
select account_nbr,symbol,total_qty from orders where order_id = (select order_id from order_activity where order_nbr='R2MQTJAUU0RDBV');

/* order table reads */
select * from orders limit 5; 
select * from order_activity limit 5; 
select * from order_processing limit 5; 
select * from order_processing where order_nbr='NT01FQ3OXJ3A0Z';
select * from order_activity where order_status='order_processing';
select * from order_activity where order_nbr='MISNEJSL0GQEY6';

/* read other tables */
select * from users; 
select * from accounts; 
select * from instruments; 

/* truncate all data */ 
truncate table users,accounts,orders,instruments,order_activity, order_processing, trades;
drop table users,accounts, orders,instruments,order_activity, order_processing, trades;
truncate table orders,order_activity, order_processing, trades;

/* */
select * from trades where symbol='QUJY';
select * from instruments where symbol='QUJY';

INSERT INTO orders (order_id, order_nbr, account_nbr, order_entry_ts, total_qty, order_type, symbol) VALUES
('850e8400-e29b-41d4-a716-446655440000', 'ORD001', '0000312587', now(), 100, 'BUY', 'JMPD');