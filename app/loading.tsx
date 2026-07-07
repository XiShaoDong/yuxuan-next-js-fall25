export default function Loading() {  
  return (  
    <div  
      style={{  
        display: "flex",  
        alignItems: "center",  
        justifyContent: "center",  
        minHeight: "100vh",  
      }}  
    >  
      <div className="spinner-border text-primary" role="status">  
        <span className="visually-hidden">Loading...</span>  
      </div>  
    </div>  
  );  
}