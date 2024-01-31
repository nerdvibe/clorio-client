export const newsHomeSchema = `
CREATE TABLE public.news_home (
    id integer NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    version_op VARCHAR(3),
    version VARCHAR(10),
    link text,
    cta text DEFAULT 'success'::text,
    visible boolean DEFAULT false NOT NULL,
    cta_color text DEFAULT 'success'::text NOT NULL
);


ALTER TABLE public.news_home OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 18283)
-- Name: news_home_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.news_home_id_seq OWNER TO postgres;

--
-- TOC entry 3137 (class 0 OID 0)
-- Dependencies: 255
-- Name: news_home_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_home_id_seq OWNED BY public.news_home.id;


--
-- TOC entry 2995 (class 2604 OID 18285)
-- Name: news_home id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_home ALTER COLUMN id SET DEFAULT nextval('public.news_home_id_seq'::regclass);


--
-- TOC entry 3130 (class 0 OID 18274)
-- Dependencies: 254
-- Data for Name: news_home; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.news_home (title, subtitle, link, cta, visible, cta_color)
VALUES
  ('👋 Welcome to ~Clorio wallet',
   'This is your personal wallet dashboard. Here you can consult your transaction history, send transactions, delegate your stake and sign/verify messages. If something is unclear and you need help, you can visit ~Clorio''s support docs page.',
   'https://minaprotocol.com/', 'Learn more', true, 'success');

--
-- TOC entry 2997 (class 2606 OID 18287)
-- Name: news_home news_home_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_home
    ADD CONSTRAINT news_home_pkey PRIMARY KEY (id);
`;
