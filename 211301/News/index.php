<?php
header('Content-Type:text/html;charset=utf-8');

$link =@mysql_connect('localhost','root','123456')|| exit('数据库连接失败')；

mysql_select_db('project5');

mysql_query('set names utf8');

$sql='select id,title,addtime from news order by addtime desc';

$result=mysql_query($sql);

$data=array();
while($row=mysql_fetch_assoc($result)){
	$data[]=$row;
}

require './news.html';
?>