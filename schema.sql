--
-- PostgreSQL database dump
--

\restrict xyUvqcDzOMCrOYq1RfJcbUKyrrXb0REHwLIuwBvZtNcfftCZNIe1l3eQ4QAyfQt

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

-- Started on 2026-02-19 14:36:13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 23 (class 2615 OID 28705)
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO postgres;

--
-- TOC entry 22 (class 2615 OID 18372)
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- TOC entry 15384 (class 0 OID 0)
-- Dependencies: 22
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- TOC entry 6 (class 3079 OID 18548)
-- Name: address_standardizer; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS address_standardizer WITH SCHEMA public;


--
-- TOC entry 15385 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION address_standardizer; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION address_standardizer IS 'Used to parse an address into constituent elements. Generally used to support geocoding address normalization step.';


--
-- TOC entry 7 (class 3079 OID 18556)
-- Name: address_standardizer_data_us; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS address_standardizer_data_us WITH SCHEMA public;


--
-- TOC entry 15386 (class 0 OID 0)
-- Dependencies: 7
-- Name: EXTENSION address_standardizer_data_us; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION address_standardizer_data_us IS 'Address Standardizer US dataset example';


--
-- TOC entry 13 (class 3079 OID 28693)
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- TOC entry 15387 (class 0 OID 0)
-- Dependencies: 13
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- TOC entry 15 (class 3079 OID 29078)
-- Name: h3; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS h3 WITH SCHEMA public;


--
-- TOC entry 15388 (class 0 OID 0)
-- Dependencies: 15
-- Name: EXTENSION h3; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION h3 IS 'H3 bindings for PostgreSQL';


--
-- TOC entry 2 (class 3079 OID 16399)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 15389 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 3 (class 3079 OID 17480)
-- Name: postgis_raster; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_raster WITH SCHEMA public;


--
-- TOC entry 15390 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis_raster; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_raster IS 'PostGIS raster types and functions';


--
-- TOC entry 16 (class 3079 OID 29194)
-- Name: h3_postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS h3_postgis WITH SCHEMA public;


--
-- TOC entry 15391 (class 0 OID 0)
-- Dependencies: 16
-- Name: EXTENSION h3_postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION h3_postgis IS 'H3 PostGIS integration';


--
-- TOC entry 12 (class 3079 OID 18782)
-- Name: mobilitydb; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS mobilitydb WITH SCHEMA public;


--
-- TOC entry 15392 (class 0 OID 0)
-- Dependencies: 12
-- Name: EXTENSION mobilitydb; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION mobilitydb IS 'MobilityDB geospatial trajectory data management & analysis platform';


--
-- TOC entry 11 (class 3079 OID 18776)
-- Name: ogr_fdw; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ogr_fdw WITH SCHEMA public;


--
-- TOC entry 15393 (class 0 OID 0)
-- Dependencies: 11
-- Name: EXTENSION ogr_fdw; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION ogr_fdw IS 'foreign-data wrapper for GIS data access';


--
-- TOC entry 17 (class 3079 OID 29252)
-- Name: pg_sphere; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_sphere WITH SCHEMA public;


--
-- TOC entry 15394 (class 0 OID 0)
-- Dependencies: 17
-- Name: EXTENSION pg_sphere; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_sphere IS 'spherical objects with useful functions, operators and index support';


--
-- TOC entry 4 (class 3079 OID 18041)
-- Name: pgrouting; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgrouting WITH SCHEMA public;


--
-- TOC entry 15395 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pgrouting; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgrouting IS 'pgRouting Extension';


--
-- TOC entry 9 (class 3079 OID 18670)
-- Name: pointcloud; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pointcloud WITH SCHEMA public;


--
-- TOC entry 15396 (class 0 OID 0)
-- Dependencies: 9
-- Name: EXTENSION pointcloud; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pointcloud IS 'data type for lidar point clouds';


--
-- TOC entry 10 (class 3079 OID 18765)
-- Name: pointcloud_postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pointcloud_postgis WITH SCHEMA public;


--
-- TOC entry 15397 (class 0 OID 0)
-- Dependencies: 10
-- Name: EXTENSION pointcloud_postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pointcloud_postgis IS 'integration for pointcloud LIDAR data and PostGIS geometry data';


--
-- TOC entry 8 (class 3079 OID 18593)
-- Name: postgis_sfcgal; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_sfcgal WITH SCHEMA public;


--
-- TOC entry 15398 (class 0 OID 0)
-- Dependencies: 8
-- Name: EXTENSION postgis_sfcgal; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_sfcgal IS 'PostGIS SFCGAL functions';


--
-- TOC entry 14 (class 3079 OID 28706)
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- TOC entry 15399 (class 0 OID 0)
-- Dependencies: 14
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- TOC entry 5 (class 3079 OID 18373)
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- TOC entry 15400 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 347 (class 1259 OID 30392)
-- Name: layers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.layers (
    layer_id integer NOT NULL,
    layer_name character varying(100),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.layers OWNER TO postgres;

--
-- TOC entry 346 (class 1259 OID 30391)
-- Name: layers_layer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.layers_layer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.layers_layer_id_seq OWNER TO postgres;

--
-- TOC entry 15401 (class 0 OID 0)
-- Dependencies: 346
-- Name: layers_layer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.layers_layer_id_seq OWNED BY public.layers.layer_id;


--
-- TOC entry 348 (class 1259 OID 30401)
-- Name: user_markers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_markers (
    id uuid NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    popup_text text,
    geom public.geometry(Point,4326) NOT NULL,
    layer_id integer,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.user_markers OWNER TO postgres;

--
-- TOC entry 345 (class 1259 OID 30384)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    user_name character varying(100),
    user_role character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 344 (class 1259 OID 30383)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 15402 (class 0 OID 0)
-- Dependencies: 344
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 15121 (class 2604 OID 30395)
-- Name: layers layer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.layers ALTER COLUMN layer_id SET DEFAULT nextval('public.layers_layer_id_seq'::regclass);


--
-- TOC entry 15119 (class 2604 OID 30387)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 15222 (class 2606 OID 30400)
-- Name: layers layers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.layers
    ADD CONSTRAINT layers_pkey PRIMARY KEY (layer_id);


--
-- TOC entry 15225 (class 2606 OID 30410)
-- Name: user_markers user_markers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_markers
    ADD CONSTRAINT user_markers_pkey PRIMARY KEY (id);


--
-- TOC entry 15220 (class 2606 OID 30390)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 15223 (class 1259 OID 30421)
-- Name: idx_user_markers_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_markers_geom ON public.user_markers USING gist (geom);


--
-- TOC entry 15226 (class 2606 OID 30416)
-- Name: user_markers user_markers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_markers
    ADD CONSTRAINT user_markers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 15227 (class 2606 OID 30411)
-- Name: user_markers user_markers_layer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_markers
    ADD CONSTRAINT user_markers_layer_id_fkey FOREIGN KEY (layer_id) REFERENCES public.layers(layer_id) ON DELETE SET NULL;


-- Completed on 2026-02-19 14:36:13

--
-- PostgreSQL database dump complete
--

\unrestrict xyUvqcDzOMCrOYq1RfJcbUKyrrXb0REHwLIuwBvZtNcfftCZNIe1l3eQ4QAyfQt

