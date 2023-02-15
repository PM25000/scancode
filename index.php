<?php
  //说明：测试的时候是连接的是远程的mssql数据库，没有在本机运行
  //初始化mssql数据库连接,分别是 主机(ip:端口号默认1433), 用户名, 密码
  //header("Content-Type: text/html;charset=utf-8");
	//header("Content-Type:text/html;charset=gb2312");
	header('Content-Type:application/json; charset=UTF-8');
  header("Cache-Control: no-cache");
  
  
  if( !isset($_POST['tsql']) ||!isset($_POST['uid']) || !isset($_POST['pwd']) )  
	{  
		 echo "Unable to connect.</br>";  
		 echo "Unable to connect.</br>";  
		 echo "Unable to connect.</br>";  
		 die("NULL");
		 //die( print_r( sqlsrv_errors(), true));  
	} 
  $tsql=$_POST['tsql']; //接收参数
$uid = $_POST['uid'];  
$pwd = $_POST['pwd'];  
$serverName = "(local)";  
  
/* Get UID and PWD from application-specific files.  */  
//$uid = "sa";  
//$pwd = "xkdsa";  
$connectionInfo = array( "UID"=>$uid,  
                         "PWD"=>$pwd,  
                         "Database"=>"dafengdzdb",
						 "TrustServerCertificate"=>"yes");  
  
/* Connect using SQL Server Authentication. */  
$conn = sqlsrv_connect( $serverName, $connectionInfo);  
if( $conn === false )  
{  
     echo "Unable to connect.</br>";  
	 echo print_r( sqlsrv_errors(), true);
     //die( print_r( sqlsrv_errors(), true));  
} 
else
{
	//echo "success";
}
  
/* Query SQL Server for the login of the user accessing the  
database. */  
//$tsql = "SELECT * FROM BILL_DET where ORDER_NO='XS2022010304'";  
$stmt = sqlsrv_query( $conn, $tsql, array(), array( "Scrollable" => 'static'));  
if( $stmt === false )  
{  
     echo "Error in executing query.</br>";  
     die( print_r( sqlsrv_errors(), true));  
}  
//$row_count = sqlsrv_num_rows( $stmt );  
//echo "abababab".$row_count;
/* Retrieve and display the results of the query. */  
// die(print_r(sqlsrv_errors(), true));
$ret=array();
if( !isset($_POST['offset']))
{
	$res=sqlsrv_num_rows($stmt);
	
	$ret['cnt']=$res;
}
else if($_POST['offset']==-1)
{
	for($i=0;$i<100;$i++)
	{
		$row = sqlsrv_fetch_array($stmt,SQLSRV_FETCH_ASSOC,SQLSRV_SCROLL_ABSOLUTE,$i);
		if($row==NULL)break;
		$ret[$i]=$row;
		//echo $i.":    "; 
		//echo "</br>";
	}
}
else if($_POST['offset']==-2)
{
	$ret='success!';
}
else
{
	$offset = $_POST['offset'];	
	$ret = sqlsrv_fetch_array($stmt,SQLSRV_FETCH_ASSOC,SQLSRV_SCROLL_ABSOLUTE,$offset);
	// for($i=0;$i<2;$i++)
	// {
		// $row = sqlsrv_fetch_array($stmt,SQLSRV_FETCH_ASSOC,SQLSRV_SCROLL_ABSOLUTE,$i+2);
		// if($row==NULL)break;
		// $ret[$i]=$row;
		// //echo $i.":    "; 
		// //echo "</br>";
	// }
}
  
/* Free statement and connection resources. */  
sqlsrv_free_stmt($stmt);  
sqlsrv_close( $conn);

exit(json_encode($ret));  
//echo json_encode($ret);  
//echo json_last_error_msg();

?>

