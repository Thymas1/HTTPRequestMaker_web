import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import {useState} from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from "axios"
import React from "react";
import { useForm } from "react-hook-form";
// @ts-ignore
import styled from "styled-components"
const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

const Home: NextPage = () => {
	const { register, handleSubmit, watch, formState: { errors } } = useForm();
	const [request, setRequest] = useState({status: "", statusText: "", responseTimeInMs: "", body: {}, headers: {}})
	const [expandBody, setExpandBody] = useState(true)
	const [expandRequestBody, setExpandRequestBody] = useState(false)
	const [expandHeaders, setExpandHeaders] = useState(false)


	const handleExpand = (type: string) => {
		if(type === "body"){
			const set = !expandBody
			setExpandBody(set)
		}
		if(type === "headers"){
			const set = !expandHeaders
			setExpandHeaders(set)
		}
		if(type === "requestBoxy"){
			const set = !expandRequestBody
			setExpandRequestBody(set)
		}

	}




	const onSubmit = async (data: any) => {
		const baseUrl = "https://httpr-equest-maker-back-ar1hw0e3h-thomasjohanendresen.vercel.app/request"
		if(data.requestType === "get"){
			const url = `${baseUrl}/getMethod?url=${data.url}`
			console.log(url);
			console.log("THIS IS A GET REQUEST")
			const request = await axios.get(url)
			setRequest(request.data)
		}
		if(data.requestType === "post"){
			const url = `${baseUrl}/postMethod?url=${data.url}`
			console.log(url);
			const body = JSON.parse(data.body)
			console.log("body", body)
			console.log("THIS IS A POST REQUEST")
			const request = await axios.post(url, body)
			setRequest(request.data)
		}
		console.log("THIS IS NOT")
	}

  // @ts-ignore
	// @ts-ignore
	return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
		  <form onSubmit={handleSubmit(onSubmit)}>
			  <Form>
				  <div>
					  <UrlInput placeholder="url for request" {...register("url")} />
					  <RequestTypeSelect placeholder="requestMethod" {...register("requestType", { required: true })} >
						  <option value="get">GET</option>
						  <option value="post">POST</option>
					  </RequestTypeSelect>
					  {errors.requestType && <span>This field is required</span>}
				  </div>
				  <Button onClick={() => handleExpand("requestBoxy")}>Click to input request body</Button>
				  {expandRequestBody && <Payload placeholder="remember to wrap in {}" {...register("body")}/>}

				  <input type="submit" />
			  </Form>
		  </form>
		  {request.status &&<section>
			  <p>status : {request.status}</p>
			  <p>status text : {request.statusText}</p>
			  <p>response time: {request.responseTimeInMs}ms</p>
			  <p onClick={() => handleExpand("body")}>Data:</p>
			  {expandBody &&
				  <DisplayJson>
					  <div>
							{typeof window !== 'undefined' && request.body && <DynamicReactJson src={request.body}/>}
					  </div>
				  </DisplayJson>
			  }

			  <p onClick={() => handleExpand("headers")}>Headers:</p>
				  {expandHeaders &&
			  		<DisplayJson>
							  <div>
								  {typeof window !== 'undefined' && request.headers && <DynamicReactJson src={request.headers}/>}
							  </div>
			  		</DisplayJson>
				  }
		  </section>}
      </main>
      <Footer className={styles.footer}>
		  <p>Project created by Thomas Johan Endresen </p>
		  <p>For all of us who belive postman can be better and simpler</p>
      </Footer>
    </div>
  )
}

	// http://api.dev-3.spense.staccx.dev/api/i18n
	// http://httpbin.org/post

export default Home


const DisplayJson = styled.div`
height: 500px;
  width:  100%;
  overflow: scroll;
`
const Footer = styled.footer`
display: flex;
  flex-direction: column;
`
const Form = styled.div`
display: flex;
  flex-direction: column;
`
const UrlInput = styled.input`
width: 300px;
  height: 40px;
`

const RequestTypeSelect = styled.select`
  margin-left: 10px;
  height: 40px;
  border: 0;
  background-color: #A8CDD0FF;
`
const Payload = styled.textarea`
  margin: 0;
  border-radius: 0;
  width: 500px;
  height: 500px;
  resize: none;
`
const Button = styled.div`
  border: 1px solid black;
  width: 200px;
  cursor: pointer;

  :hover {
	background-color: #a8cdd0;
  }
`
