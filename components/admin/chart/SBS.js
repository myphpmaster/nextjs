/*  ./components/admin/chart/Visual.js     */
export const Chart = () => {
    
  return (

<>

                <div className="w-full p-3">
                    
                    <div className="bg-white border rounded shadow">
                        <div className="border-b p-3">
                            <h5 className="font-bold uppercase text-gray-600 text-center">Any symptoms during working here?</h5>
                        </div>
                        <div className="p-5">
                             <div className="relative" style={{width: '100%', height: '500px'}}>
                                <iframe className="absolute inset-0 w-full h-full" src="/chart/radar/symptoms" frameBorder="0" />
                            </div>
                        </div>
                    </div>
                    
                </div>

                
</>

  );
};