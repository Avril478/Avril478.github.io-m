const showHome = () => {
    document.getElementById("homePage").style.display = "block"
    document.getElementById("stuffPage").style.display = "none"
    document.getElementById("coursePage").style.display = "none"
    document.getElementById("infoPage").style.display = "none"

}
const showStaff = () => {
    document.getElementById("homePage").style.display = "none"
    document.getElementById("stuffPage").style.display = "block"
    document.getElementById("coursePage").style.display = "none"
    document.getElementById("infoPage").style.display = "none"
    window.onload = drawTable()

}
const showCourse = () => {
    document.getElementById("homePage").style.display = "none"
    document.getElementById("stuffPage").style.display = "none"
    document.getElementById("coursePage").style.display = "block"
    document.getElementById("infoPage").style.display = "none"
    window.onload = course()
}
const showInfo = () => {
    document.getElementById("homePage").style.display = "none"
    document.getElementById("stuffPage").style.display = "none"
    document.getElementById("coursePage").style.display = "none"
    document.getElementById("infoPage").style.display = "block"
    window.onload = info()
}

const info = () =>{
    const getFetch = fetch("https://cws.auckland.ac.nz/qz20/Quiz2020ChartService.svc/g", {
        headers: {
            "Accept": "application/json"
        }
    })
    const fetchPromise = getFetch.then((response) => response.json())
    fetchPromise.then((data) => draw(data))
}

const draw = (data) =>{
    document.getElementById("svg").innerHTML= '<symbol id="mysvg" width="15" height="20" viewBox="0 0 20 20"><image href="https://www.cs.auckland.ac.nz/courses/compsci335s2c/lectures/mano/qz/MathLogo.svg" width="20" height="20"/> </symbol>'
    document.getElementById("i").innerText = JSON.stringify(data)
    document.getElementById("svg").innerHTML += '<rect x="0" y="0" width="150" height="400" fill="#dddddd" /> '

    let X = 10
    let x = 6
    let index = 1


    const drawinfo = (number) =>{
        document.getElementById("svg").innerHTML += '<text x="'+X+'" y="20" class="text">'+ index +'</text>'
        let y = 20
        let num = parseInt(number /10)
        let fraction  = number % 10
        for(let i=1; i<=num;i++) {
            document.getElementById("svg").innerHTML += "<use xlink:href='#mysvg' x='" + x + "' y='"+y+"' />"

            y += 20
        }

        if (fraction>0){
            console.log(fraction)
            document.getElementById("svg").innerHTML += "<g clip-path=url(#cut"+index+")><use xlink:href='#mysvg' x='" + x + "' y='"+y+"'/></g>"
            document.getElementById("svg").innerHTML += "<defs><clipPath id='cut"+index+"'><rect x='"+x+"' y = '"+ y+"' width='"+15*fraction*0.1+"' height='30'/></clipPath></defs>"
        }


        x += 20
        X += 20
        index += 1
    }




    data.forEach(number => drawinfo(number))
}

const course = () =>{
    const getFetch = fetch("https://api.test.auckland.ac.nz/service/courses/v2/courses?subject=MATHS&year=2020&size=500", {
        headers: {
            "Accept": "application/json"
        }
    })
    const fetchPromise = getFetch.then((response) => response.json())
    fetchPromise.then((data) => addCourse(data.data))
}

const addCourse = (data) =>{
    const table = document.getElementById("courseTable")
    let tableContent = "<tr><td>Course</td><td>Title</td><td>Description</td><td>Requirements</td><td>Timetable</td></tr>"
    const  addToTable = (c) =>{
        tableContent += "<tr><td>"+c.mainProgram+ "-" +c.subject+ c.catalogNbr+"</td>"
        tableContent += "<td>"+c.title+"</td>"
        if (c.hasOwnProperty('description')){
            tableContent += "<td>"+c.description+"</td>"
        }
        else{
            tableContent += "<td> No description</td>"
        }
        if (c.hasOwnProperty("rqrmntDescr")){
            tableContent += "<td>"+c.rqrmntDescr+"</td>"
        }
        else {
            tableContent += "<td>No requirement</td>"
        }
        tableContent += "<td><button class='button' onclick='showDetail("+ c.catalogNbr+")'>More detail</button></td></tr>"

    }


    data.forEach(c => addToTable(c))
    table.innerHTML = tableContent


}

const showDetail = (n) =>{
    const f= fetch("https://api.test.auckland.ac.nz/service/classes/v1/classes?year=2020&subject=MATHS&size=500&catalogNbr= "+ n )
    const Promise = f.then((response) => response.json());
    Promise.then((data => window.alert(JSON.stringify(data.data))))

}

const addPhone = (staff) => {
    const f= fetch("https://dividni.com/cors/CorsProxyService.svc/proxy?url=https%3A%2F%2Funidirectory.auckland.ac.nz%2Fpeople%2Fvcard%2F"+staff.profileUrl[1])
    const Promise = f.then((response) => response.text());
    Promise.then((data) => getPhone(data,staff.profileUrl[1]))

}


const getPhone = (card, upi) => {
    const array = card.split("\n");
    for (let i = 0; i < array.length; ++i) {
        array[i] = array[i].split(":")
    }
    const tele = array.filter((e) => e[0].includes("TEL"))
    if (tele[0] != undefined) {
        const telephone = tele[0][1]
        document.getElementById(upi).innerHTML = telephone
        document.getElementById(upi).href = "tel:" + telephone
    }
}





const addStuff = (list) =>{
    const table = document.getElementById("ourTable")
    let tableContent = "<tr><td>Staff Name</td><td>Photo</td><td>Contacts</td>"
    const  addToTable = (staff) =>{
        tableContent += "<tr><td>"+staff.firstname+"</td>"
        tableContent += "<td><img src='https://dividni.com/cors/CorsProxyService.svc/proxy?url=https%3A%2F%2Funidirectory.auckland.ac.nz%2Fpeople%2Fimageraw%2F" + staff.profileUrl[1] + "%2F" + staff.imageId + "%2Fbiggest' alt='No photo'></td>"
        tableContent += "<td><a id ="+staff.profileUrl[1] +" href=>Phone</a>"
        tableContent += "<br><a href=mailto:"+staff.emailAddresses[0]+">"+staff.emailAddresses[0]+"</a></br>"
        tableContent += "<br><a href= https://unidirectory.auckland.ac.nz/people/vcard/"+staff.profileUrl[1] +">Add to contacts</a></b></td>"
    }

    list.forEach(staff => addToTable(staff))
    table.innerHTML = tableContent
    list.forEach(staff => addPhone(staff))

}


const drawTable = () =>{
    const getFetch = fetch("https://dividni.com/cors/CorsProxyService.svc/proxy?url=https%3A%2F%2Funidirectory.auckland.ac.nz%2Frest%2Fsearch%3ForgFilter%3DMATHS", {
        headers: {
            "Accept": "application/json"
        }
    })
    const fetchPromise = getFetch.then((response) => response.json())
    fetchPromise.then((data) => addStuff(data.list))
}

window.onload = showHome