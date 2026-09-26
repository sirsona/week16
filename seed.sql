--
-- PostgreSQL database dump
--

\restrict WzgR4egc5oz0sgtC5fOn9A0fnQdTnlLUMZYa98F9VKVafNdeZqhPg95A4QdmSbM

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: crm_user
--

COPY public.products (id, slug, name, description, price_cents, image_url, in_stock, created_at, category) FROM stdin;
ea245d01-81ca-4d78-b29c-57fec2d5cc08	the-martian	The Martian	A gripping sci-fi survival story by Andy Weir.	129900	/images/the-martian.jpg	12	2026-07-28 06:08:00.244585+03	Books
079ce8b5-0ddd-47a0-a482-c0608394956a	atomic-habits	Atomic Habits	Tiny changes, remarkable results by James Clear.	189900	/images/atomic-habits.jpg	8	2026-07-28 06:08:00.244585+03	Books
ca89cd68-8f2f-4e93-90c3-b16181319ef5	sapiens	Sapiens: A Brief History of Humankind	The story of how humans conquered the world by Yuval Noah Harari.	159900	/images/sapiens.jpg	5	2026-07-28 06:08:00.244585+03	Books
5c87f4c7-f5b1-4bf2-a18c-c15202c7f432	the-hobbit	The Hobbit	The classic prequel to The Lord of the Rings by J.R.R. Tolkien.	119900	/images/the-hobbit.jpg	15	2026-07-28 06:08:00.244585+03	Books
3afc043e-6695-4165-95c7-e04dd08a09d6	dune	Dune	The epic sci-fi masterpiece by Frank Herbert.	159900	/images/dune.jpg	6	2026-07-28 06:08:00.244585+03	Books
4332b9b1-76a6-4ae8-8638-75afc9cf3037	the-creative-act	The Creative Act: A Way of Being	The artist’s handbook by Rick Rubin.	249900	/images/the-creative-act.jpg	3	2026-07-28 06:08:00.244585+03	Self-Help
7c5c7024-cfd5-4d31-bfc7-3a1f768434f7	the-house-of-ancestors	The House of Ancestors	Exploring African history and spirituality.	139900	/images/house-of-ancestors.jpg	7	2026-07-28 06:08:00.244585+03	History
9483c5c2-73b9-4d84-b697-412300fad952	little-women	Little Women	Louisa May Alcott’s timeless classic.	99900	/images/little-women.jpg	10	2026-07-28 06:08:00.244585+03	Classic
\.


--
-- PostgreSQL database dump complete
--

\unrestrict WzgR4egc5oz0sgtC5fOn9A0fnQdTnlLUMZYa98F9VKVafNdeZqhPg95A4QdmSbM

