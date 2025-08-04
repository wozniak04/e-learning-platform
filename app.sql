--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.2

-- Started on 2025-08-04 18:11:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 222 (class 1255 OID 27595)
-- Name: add_user(text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_user(p_email text, p_password_hash text, p_login text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
  email_exists BOOLEAN;
  login_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM users WHERE email = p_email) INTO email_exists;
  SELECT EXISTS(SELECT 1 FROM users WHERE login = p_login) INTO login_exists;

  IF email_exists AND login_exists THEN
    RETURN 'BOTH_EXIST';
  ELSIF email_exists THEN
    RETURN 'EMAIL_EXISTS';
  ELSIF login_exists THEN
    RETURN 'LOGIN_EXISTS';
  ELSE
    INSERT INTO users (email, password_hash, login)
    VALUES (p_email, p_password_hash, p_login);
    RETURN 'OK';
  END IF;
END;
$$;


ALTER FUNCTION public.add_user(p_email text, p_password_hash text, p_login text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 27584)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(256) NOT NULL,
    password_hash character varying(60) NOT NULL,
    login character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1255 OID 27603)
-- Name: login(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.login(k_login text) RETURNS public.users
    LANGUAGE plpgsql
    AS $$
declare wynik users;
begin
select * into wynik from users where email=k_login or login=k_login;
return wynik;
end;
$$;


ALTER FUNCTION public.login(k_login text) OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 27599)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 27596)
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 27583)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4812 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4651 (class 2604 OID 27587)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4806 (class 0 OID 27599)
-- Dependencies: 220
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students  FROM stdin;
\.


--
-- TOC entry 4805 (class 0 OID 27596)
-- Dependencies: 219
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers  FROM stdin;
\.


--
-- TOC entry 4804 (class 0 OID 27584)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, login) FROM stdin;
1	test1@wd.pl	$2b$11$DwJ26Bp9NFcTjt5/v93Gl.m6ME8pD9.MQdR8Z4v4M8Y88Zfa1U1M.	test1
2	test2@wd.pl	$2b$11$GhKTMP7Ertr3HZGPhfeqn.f6/h7T4c2ig./HltdlcCsfli/pPKlH6	test2
\.


--
-- TOC entry 4813 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4653 (class 2606 OID 27591)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4655 (class 2606 OID 27593)
-- Name: users users_login_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- TOC entry 4657 (class 2606 OID 27589)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2025-08-04 18:11:44

--
-- PostgreSQL database dump complete
--

