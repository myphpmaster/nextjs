/*  ./components/admin/generalData.js     */
import React, { useState } from "react";
import useSWR, { useSWRInfinite } from "swr";
import { useRouter } from "next/router";

export const Table = () => {
    
	const router = useRouter();

    console.log(JSON.stringify(router))

    const path = router.asPath
	const slug = router.query.slug || []
	const page = slug[0] || false
	const subpage = parseInt(slug[1]) || 1

    const fetcher = url => fetch(url).then(res => res.json());
    const { data } = useSWR(() => `/api/submissions/?limit=1&page=${subpage}&nocache=1`, fetcher)
    const datas = data ? [].concat(...data) : [];

    const { data: count } = useSWR(() => '/api/count/', fetcher)

    const results = [];
    datas.forEach(function(value, index, array) {
        results.push(value.data);
    }); 
        
    const { data: schem } = useSWR(() => '/api/label/', fetcher)
    const schems = schem ? [].concat(...schem) : [];

    const renders = []
    const filters = ['type','key','label','suffix','prefix','questions','values']
    var x=0
    var inputs={}
    for (let i = 0; i < schems.length; i++) {
        // direct input
        if(schems[i].input) {
            inputs={}
            inputs=filterProps(schems[i],filters)
            renders.push(inputs)
            x++
        // panel
        }else if(schems[i].type=='panel'){
			let obj = schems[i].components
            var panel = {}
            panel.id = i
            panel.key = schems[i].key
            panel.title = schems[i].title
            // console.log('panel['+i+']=>'+JSON.stringify(panel))
			for (let j = 0; j < obj.length; j++) {
				if (obj[j].type == 'columns'){
					let col = obj[j].columns
					for (let k = 0; k < col.length; k++) {
						let subcol = [] = col[k].components
						for (let l = 0; l < subcol.length; l++) {
							if (subcol[l].input) {
                                inputs={}
                                inputs.panel = (schems[i].type=='panel') ? panel : false
                                inputs=filterProps(subcol[l],filters,inputs)
                                // console.log('inputs['+x+']=>'+JSON.stringify(inputs))
                                renders.push(inputs)
                                x++
							}
						}
					}
				}else if (obj[j].input) {
                    inputs={}
                    inputs.panel = (schems[i].type=='panel') ? panel : false
                    inputs=filterProps(obj[j],filters,inputs)
                    renders.push(inputs)
				}
			}			
        }
    }

    //console.log('results->'+JSON.stringify(results))
    //console.log('schems->'+JSON.stringify(schems))
    //console.log('renders->'+JSON.stringify(renders))
    
    return (
            <>
                <div className="w-full p-3">
                    <div className="bg-white border rounded shadow">
                        <div className="border-b p-3">


                            <h5 className="font-bold uppercase text-gray-600 text-center">Latest Entry</h5>

                        { (subpage > 1) && <>
                            <a className="bg-gray-50 hover:bg-blue-50 w-1/3 inline-block md:w-auto items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700" 
                                href={ `${path+(subpage-1)}/`}>Previous</a>
        		        </>}
                        { (subpage < count ) && <>
                            <a className="bg-gray-50 hover:bg-blue-50 w-1/3 inline-block md:w-auto items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700" 
                                href={ `${path+(subpage+1)}/`}>Next</a>
        		        </>}

                        </div>
                        <div className="p-5">
                            { results.map( (val, index) => (
                                <div key={index} className="pb-10 border-gray-400 border mx-4">
                                    <dl>
                                        { schems.map( (section, key) => (                                       
                                            <div key={key} >
                                                <div className="text-center bg-gray-200 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-black" data-id={section.key}>
                                                    {section.title}
                                                    </dt>
                                                </div>
                                                {renders.filter(el => el.panel.id == key).map( (comp, num) => ( 
                                                    renderData(comp, val, num)
                                                ))} 
                                            </div>
                                        ))}    
                                    </dl>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
    );
};

function renderData(comp, val, id) {

    var table = ["bg-gray-50", "bg-white"]
    var tableClass = (id % 2 == 0) ? table[0] : table[1]
    var value = val[comp.key]
    const oriVal = value

    //console.log('comp[' + id + ']=>' + JSON.stringify(comp))
    //console.log('val[' + id + ']=>' + JSON.stringify(val[comp.key]))

    switch (comp.type) {
        case 'select':
        case 'radio':

            let choices = comp.values
            for (let j = 0; j < choices.length; j++) {
                if(choices[j].value==value){
                    value = choices[j].label
                }
            }            

            break;
    
        default:
            break;
    }

    if( typeof val[comp.key] !== 'object' ){
        return (
        <div key={id} className={`${tableClass} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
            <dt className="text-sm font-medium text-gray-500" data-id={comp.key}>
                {comp.label}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2" data-id={oriVal}>
                {value}
            </dd>
        </div>
        )
    } else if( comp.type == 'survey' ) {
        
        return (
            <div key={id} className={`${tableClass} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                <dt className="text-sm font-medium text-gray-500" data-id={comp.value}>
                    {comp.label}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        
                        { comp.questions.map( (com, num)=> (                                                    
                            renderSurvey(com, comp.values, value[com.value], num)                             
                        ))}

                    </ul>
                </dd>
            </div>
        );

    }

}

function renderSurvey(question, values, value, num) {
   
    var oriVal = value
    var table = ["bg-gray-50", "bg-white"]
    var tableClass = (num % 2 == 0) ? table[0] : table[1]
        
    for (let j = 0; j < values.length; j++) {
        if(values[j].value==value){
            value = values[j].label
        }
    }

    return (
        
        <li key={num} className={`${tableClass}pl-3 pr-4 py-3 flex items-center justify-between text-sm`}>
            <div className="w-0 flex-1 flex items-center">

                <span className="ml-2 flex-1 w-0 truncate" data-id={question.value}>
                    {question.label}
                </span>
            </div>
            <div className="ml-4 flex-shrink-0" data-id={oriVal}>
                    {value}
            </div>
        </li>

    )

}

function filterProps(objects={},props=[],inputs={}){
    for (let i = 0; i < props.length; i++) {
        inputs[props[i]] = objects.hasOwnProperty(props[i]) ? objects[props[i]] : false
    }
    if( inputs.type=='select' && props.includes('values') ){
        inputs.values = objects.data.values
    }
    return inputs
}