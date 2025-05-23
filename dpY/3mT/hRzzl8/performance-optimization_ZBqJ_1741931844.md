
* blog posts
	- http://jmoiron.net/blog/go-performance-tales/
                - use integer map keys if possible
                - hard to compete with Go's map implementation; esp. if your data structure has lots of pointer chasing
                - aes-ni instructions make string hashing much faster
                - prefer structs to maps if you know the map keys (esp. coming from perl, etc)
                - channels are useful, but slow; raw atomics can help with performance
                - cgo has overhead
                - profile before optimizing
	- http://slideshare.net/cloudflare/go-profiling-john-graham-cumming ( https://www.youtu.be/_41bkNr7eik )
            - don't waste programmer cycles saving the wrong CPU cycles (or memory allocations)
            - bash$ time; time.Now()/time.Since(); pprof.StartCPUProfile/pprof.StopCPUProfile; go tool pprof http://.../profile
            - bash$ ps; runtime.ReadMemStats(); runtime.WriteHeapProfile(); go tool pprof http://.../heap
            - slice operations are sometimes O(n)
            - https://golang.org/pkg/runtime/debug/
            - sync.Pool (basically)
	- https://methane.github.io/2015/02/reduce-allocation-in-go-code
            - 1. correctness is important
            - 2. BenchmarkXXX with b.ReportAllocs() (or -benchmem when running)
            - 3. allocfreetrace=1 produces stack trace on every allocation
            - strategies:
                - avoid string concat; use []byte+append() (+strconv.AppendInt(), ...)
                - benchcmp
                - avoid time.Format
                - avoid range when iterating strings ([]rune conversion + utf8 decoding)
                - can append string to []byte
                - write two versions, one for string, one for []byte (avoids conversion+copy (sometimes...))
                - reuse existing buffers instead of creating new ones
	- http://bravenewgeek.com/so-you-wanna-go-fast/
            - performance fast vs. delivery fast; make the right decision
            - lock-free ring buffer vs. channels: faster except with GOMAXPROCS=1
            - defer has a cost (allocation+cpu)
                BenchmarkMutexDeferUnlock-8 20000000 96.6 ns/op
                BenchmarkMutexUnlock-8 100000000 19.5 ns/op
            - reflection+json
                - ffjson avoids reflection
                - msgp avoids json
                - interfaces have dynamic dispatch which can't be inlined
                - => use concrete types (+ code duplication)
            - heap vs. stack; escape analysis
            - lots of short-lived objects is expensive for the gc
            - sync.Pool reuses objects *between* gc runs
            - you need your own free list to hold onto things between gc runs
                (but now you're subverting the purpose of a garbage collector)
            - false sharing
            - custom lock-free data structures: fast but *hard*
            - "Speed comes at the cost of simplicity, at the cost of development time, and at the cost of continued maintenance. Choose wisely."
	- https://software.intel.com/en-us/blogs/2014/05/10/debugging-performance-issues-in-go-programs
	- http://blog.golang.org/profiling-go-programs
	- https://medium.com/%40hackintoshrao/daily-code-optimization-using-benchmarks-and-profiling-in-golang-gophercon-india-2016-talk-874c8b4dc3c5
	- If you're writing benchmarks, read http://dave.cheney.net/2013/06/30/how-to-write-benchmarks-in-go
  - cache line explanation: http://mechanitis.blogspot.com/2011/07/dissecting-disruptor-why-its-so-fast_22.html
  - avoiding false sharing: http://www.drdobbs.com/parallel/eliminate-false-sharing/217500206
  - how does this translate to go? http://www.catb.org/esr/structure-packing/
  - https://en.wikipedia.org/wiki/Amdahl%27s_law
  - https://github.com/ardanlabs/gotraining/tree/master/topics/profiling
  - https://github.com/ardanlabs/gotraining/tree/master/topics/benchmarking
  - http://dave.cheney.net/2015/11/29/a-whirlwind-tour-of-gos-runtime-environment-variables
  - https://github.com/davecheney/high-performance-go-workshop
  - Mutex profile: https://rakyll.org/mutexprofile
  - https://segment.com/blog/allocation-efficiency-in-high-performance-go-services/
  - http://brendanjryan.com/2018/01/15/go-benchmarks.html
  - https://lemire.me/blog/2018/01/16/microbenchmarking-calls-for-idealized-conditions/
  - https://signalfx.com/blog/a-pattern-for-optimizing-go-2/
  - https://medium.com/@hackintoshrao/daily-code-optimization-using-benchmarks-and-profiling-in-golang-gophercon-india-2016-talk-874c8b4dc3c5
  - https://artem.krylysov.com/blog/2017/03/13/profiling-and-optimizing-go-web-applications/
  - https://segment.com/blog/allocation-efficiency-in-high-performance-go-services/
  - https://www.cockroachlabs.com/blog/how-to-optimize-garbage-collection-in-go/
  - https://hashrocket.com/blog/posts/go-performance-observations
	- https://lists.freebsd.org/pipermail/freebsd-current/2010-August/019310.html
	- https://marcellanz.com/post/file-read-challenge/
	- https://boyter.org/posts/sloc-cloc-code/

cgo:
    cgo has overhead
        (which has only gotten more expensive over time) -- ~200 ns/call
        (reduced in 1.8 to <100ns; still not free)
    ssa backend means less difference in codegen
    really think if you want cgo: http://dave.cheney.net/2016/01/18/cgo-is-not-go
    https://www.youtube.com/watch?v=lhMhApWQp2E : cgo gophercon
    cgo performance tracking bug: https://github.com/golang/go/issues/9704

videos:
    https://gophervids.appspot.com/#tags=optimization
        -- figure out which of these are specifically worth listing

    "Profiling and Optimizng Go" (Uber)
    https://www.youtube.com/watch?v=N3PWzBeLX2M

    https://go-talks.appspot.com/github.com/davecheney/presentations/writing-high-performance-go.slide
    https://www.youtube.com/watch?v=zWp0N9unJFc

    Björn Rabenstein
    https://docs.google.com/presentation/d/1Zu0BdbhMRar7ycEwDi8jepGokTXTDXlKFf7C13tusuI/edit
    https://www.youtube.com/watch?v=ZuQcbqYK0BY

    https://go-talks.appspot.com/github.com/mkevac/golangmoscow2016/gomeetup.slide

    CppCon 2014: Chandler Carruth "Efficiency with Algorithms, Performance with Data Structures"
    https://www.youtube.com/watch?v=fHNmRkzxHWs

    Performance Engineering of Software Systems
    https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-172-performance-engineering-of-software-systems-fall-2018/

    https://talks.golang.org/2013/highperf.slide#1

    Machine Architecture: Things Your Programming Language Never Told You
    https://www.youtube.com/watch?v=L7zSU9HI-6I

    7 Ways to Profile Go Applications
    https://www.youtube.com/watch?v=2h_NFBFrciI

    dotGo 2016 - Damian Gryski - Slices: Performance through cache-friendliness
    https://www.youtube.com/watch?v=jEG4Qyo_4Bc

    Performance Bugs
    https://www.youtube.com/watch?v=89qiHoDjeDg

    The Hurricane's Butterfly: Debugging Pathologically Performing Systems
    https://www.youtube.com/watch?v=7AO4wz6gI3Q

    "So You Wanna Go Fast?" by Tyler Treat
    https://www.youtube.com/watch?v=DJ4d_PZ6Gns

    GopherCon 2017: Peter Bourgon - Evolutionary Optimization with Go
    https://www.youtube.com/watch?v=ha8gdZ27wMo

    CppCon 2015: Bryce Adelstein-Lelbach “Benchmarking C++ Code"
    https://www.youtube.com/watch?v=zWxSZcpeS8Q

		CppCon 2018: Fedor Pikus “Design for Performance”
    https://www.youtube.com/watch?v=m25p3EtBua4

asm:
    https://golang.org/doc/asm
    https://goroutines.com/asm
    http://www.doxsey.net/blog/go-and-assembly
    https://www.youtube.com/watch?v=9jpnFmJr2PE
    https://blog.gopheracademy.com/advent-2016/peachpy/
    https://blog.sgmansfield.com/2017/04/a-foray-into-go-assembly-programming/
    http://lemire.me/blog/2016/12/21/performance-overhead-when-calling-assembly-from-go/
    http://davidwong.fr/goasm/
    minio posts + tooling
    https://github.com/teh-cmc/go-internals/blob/master/chapter1_assembly_primer/README.md
    https://blog.hackercat.ninja/post/quick_intro_to_go_assembly/
		https://quasilyte.dev/blog/post/go-asm-complementary-reference/

posts:
    http://www.eecs.berkeley.edu/~rcs/research/interactive_latency.html
    https://arxiv.org/abs/1509.05053 (array layouts for comparison-based searching)
    http://grokbase.com/t/gg/golang-nuts/155ea0t5hf/go-nuts-after-set-gomaxprocs-different-machines-have-different-bahaviors-some-speed-up-some-slow-down
    http://grokbase.com/t/gg/golang-nuts/14138jw64s/go-nuts-concurrent-read-write-of-different-parts-of-a-slice

    Escape Analysis Flaws
    https://docs.google.com/document/d/1CxgUBPlx9iJzkz9JWkb6tIpTe5q32QDmz8l0BouG0Cw/preview

    https://hackernoon.com/optimizing-optimizing-some-insights-that-led-to-a-400-speedup-of-powerdns-5e1a44b58f1c
    http://leto.net/docs/C-optimization.php

    http://www.stochasticlifestyle.com/algorithm-efficiency-comes-problem-information/

tools:
    https://godoc.org/github.com/aclements/go-perf
    https://godoc.org/x/perf/cmd/benchstat
    https://github.com/rakyll/gom
    https://github.com/tam7t/sigprof
    https://github.com/aybabtme/dpprof
    https://github.com/wblakecaldwell/profiler
    https://github.com/MiniProfiler/go
    https://perf.wiki.kernel.org/index.php/Main_Page
    https://github.com/dominikh/go-structlayout
    http://www.brendangregg.com/perf.html
    https://github.com/davecheney/gcvis
    https://github.com/pavel-paulau/gcterm
    https://github.com/jonlawlor/benchls

pprof:
    https://rakyll.org/pprof-ui/
    https://rakyll.org/custom-profiles/

trace:
    https://making.pusher.com/go-tool-trace/
    https://www.youtube.com/watch?v=mmqDlbWk_XA
    https://www.youtube.com/watch?v=nsM_m4hZ-bA
    https://blog.gopheracademy.com/advent-2017/go-execution-tracer/

papers:
    https://www.akkadia.org/drepper/cpumemory.pdf
    https://software.intel.com/sites/default/files/article/392271/aos-to-soa-optimizations-using-iterative-closest-point-mini-app.pdf

optimization guides:
    http://developer.amd.com/resources/developer-guides-manuals/
    http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.uan0015b/index.html
    https://www-ssl.intel.com/content/www/us/en/architecture-and-technology/64-ia-32-architectures-optimization-manual.html
    https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines.html#S-performance
    https://github.com/fenbf/AwesomePerfCpp
    https://www.kernel.org/pub/linux/kernel/people/paulmck/perfbook/perfbook.2017.11.22a.pdf

stackoverflow:
    https://stackoverflow.com/questions/19397699/why-struct-with-padding-fields-works-faster/19397791#19397791
    https://stackoverflow.com/questions/10017026/no-speedup-in-multithread-program/10017482#10017482

practice:
    https://twitter.com/dgryski/status/584682584942194689

distributed system design: (out of scope for this book)
    http://highscalability.com/blog/2010/12/20/netflix-use-less-chatty-protocols-in-the-cloud-plus-26-fixes.html

books:
Writing Efficient Programs
Algorithm Engineering: https://www.springer.com/gp/book/9783642148651
http://www.cs.tufts.edu/~nr/cs257/archive/don-knuth/empirical-fortran.pdf

Usborne: Programming Tricks and Skills
https://drive.google.com/file/d/0Bxv0SsvibDMTdElPMHF5NVpmU0U/view

Quotes: (Bumper Sticker Computer Science)
    [The First Rule of Program Optimization] Don't do it.
    [The Second Rule of Program Optimization---For experts only] Don't do it yet.
            Michael Jackson
            Michael Jackson Systems Ltd.

The key to performance is elegance, not battalions of special cases.
        — Jon Bentley and Doug McIlroy

You’re bound to be unhappy if you optimize everything.
        — Donald Knuth

You'll never know how bad things are until you look.
				- Howard Chu
