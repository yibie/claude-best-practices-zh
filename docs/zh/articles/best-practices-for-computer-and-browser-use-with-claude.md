---
title: "Claude 计算机与浏览器使用的最佳实践"
source_url: "https://claude.com/resources/articles/best-practices-for-computer-and-browser-use-with-claude"
publisher: "claude.com"
type: "blogPost"
date: "2026-05-13"
products: ["Claude Platform"]
read_time: 42
excerpt: "为使用 Claude 模型系列构建计算机与浏览器使用集成的开发者提供的实用指南。"
fetched_at: "2026-11-18"
---

# Claude 计算机与浏览器使用的最佳实践
Claude 的[最新模型](https://www.anthropic.com/news/claude-sonnet-4-6)在计算机与浏览器使用能力方面实现了重大进步。借助这些特性，LLM 现在能够驱动日益复杂的智能体式系统来完成实际工作，例如构建软件应用，以及跨多种异构技术自动化工作流。

在这篇博文中，我们分享将 Claude 用于计算机与浏览器使用的最佳实践，涵盖从简单的配置更改到更高级的集成模式。我们希望这篇文章能在你开始将 Claude 的计算机与浏览器使用能力集成到产品中时提供帮助。我们还发布了一个新的[演示实现](https://github.com/anthropics/claude-quickstarts/tree/main/computer-use-best-practices)，它封装了其中一些最佳实践，并提供了在 Claude 计算机使用能力之上进行开发时有用的额外工具。

_请注意，除非另有说明，这些建议适用于 Claude 4.6 系列（Opus 4.6、Sonnet 4.6、Haiku 4.5）以及 Claude Opus 4.7。当 4.6 系列与 Opus 4.7 之间的指导有所不同时，我们会在文中直接指出。我们的发现基于内部实验，未来随着新模型和新技术的出现可能会更新。_

## **入门：分辨率与缩放**

点击准确率是任何计算机使用集成的基础。如果点击没有落在应在的位置，下游的一切都无法工作：表单无法填写、按钮无法按下、工作流失败。影响最大的单项优化同时也是最简单的之一：在将截图发送给 API 之前预先降采样。

## **确保正确的缩放**

当你将截图发送给 Claude 的 Computer Use API 时，模型会看到它，并在你指定的 display\_width\_px / display\_height\_px 坐标空间中返回点击坐标。但有一个重要约束：API 对图像尺寸有内部处理限制。超过这些限制的图像会在模型看到之前被降采样，这意味着模型是基于降质版本的图像进行点击，而你的执行框架（harness）却期望坐标与原始分辨率对齐。

对于我们的 Claude 4.6 模型系列，API 的限制为：

-   **最大长边**：1568 像素
-   **最大总像素**：1.15 百万像素
-   超过**任一**限制的图像会在内部被降采样

我们的 Opus 4.7 模型支持更高分辨率。限制为：

-   **最大长边**：2576 像素
-   **最大总像素**：3.75 百万像素
-   超过**任一**限制的图像会在内部被降采样

当坐标空间与模型感知到的图像不匹配时，模型预测的点击会落在与其实际看到的图像不同的显示尺度上。这是高分辨率下点击不准确的主要原因。修复方法很直接：在将截图发送给 API 之前，始终将其降采样到这些限制之内。我们一致观察到，当图像超过限制时准确率会显著下降，而这一项更改的价值几乎超过任何其他优化。

## **推荐分辨率**

**从 1280x720 开始。** 这对大多数用例来说是一个安全、实用的默认值。它使用约 80% 的像素预算，远在长边和总像素限制之内，并且是模型在训练中见过的标准分辨率。它对现代 Web UI 和遗留桌面应用都很有效。

**如果你使用的是 Opus 4.7，我们建议从 1080p 开始**，因为相比 720p 它能带来明显的质量提升，并在 token 用量与性能之间提供良好的平衡。

**对于希望最大化模型接收到的视觉信息的开发者**，我们还推荐一种「最大 API 适配」方法：根据源图像的原生宽高比，为每张图像计算最优分辨率：

```
import math

# 1568 for 4.6 family, 2576 for Opus 4.7
MAX_LONG_EDGE = 1568

# 1.15MP for 4.6 family, 3.75MP for Opus 4.7
MAX_PIXELS = 1_150_000

def compute_max_api_fit(native_w, native_h):
    """Compute the largest resolution that fits API limits
    while preserving aspect ratio."""
    aspect = native_w / native_h

    # Compute max dimensions from pixel budget
    h_from_pixels = math.sqrt(MAX_PIXELS / aspect)
    w_from_pixels = h_from_pixels * aspect

    # Apply long edge constraint
    if native_w >= native_h:
        w = min(w_from_pixels, MAX_LONG_EDGE)
        h = w / aspect
    else:
        h = min(h_from_pixels, MAX_LONG_EDGE)
        w = h * aspect

    # Never upscale beyond native
    w = min(w, native_w)
    h = min(h, native_h)

    return int(w), int(h)
```

这种方法稍微复杂一些，但避免了宽高比失真，并充分利用了每张图像可用的全部像素预算。相比固定的 1280x720，准确率提升幅度不大，但它实现简单，且避免了将 16:9 源图像强制放入 4:3 显示分辨率时产生的失真。

**应避免的分辨率：**

-   **原生分辨率（未缩放）**：除非你的源图像恰好低于分辨率限制，否则发送原生分辨率截图是点击准确率差的最常见原因。
-   **极低分辨率（低于 960x540）**：在低分辨率图像中，细节丢失过多，模型无法准确识别小型 UI 元素。
-   **如果你在 MacOS 上：** 浏览器使用的一个常见问题是，MacOS 上的截图通常以设备像素比 2 捕获，这意味着你最终得到的图像分辨率可能是屏幕坐标的 2 倍。
-   **如果你使用的是 4.6 系列，避免 1920x1080 及以上**：这些会超过像素限制并被静默降采样。在 Opus 4.7 上上限更高（3.75 MP），因此 1080p 和 1440p 在预算之内；但仍应避免未经降采样的原生 4K。

## **坐标缩放**

当你在发送前调整截图尺寸时，模型会以你指定的显示分辨率返回点击坐标。在执行点击之前，你必须将这些坐标缩放回实际的屏幕分辨率：

```
# Your screen is screen_w x screen_h
# You sent a screenshot resized to display_w x display_h
scale_x = screen_w / display_w
scale_y = screen_h / display_h

screen_x = int(api_returned_x * scale_x)
screen_y = int(api_returned_y * scale_y)
```

这很直接但至关重要，因为如果你忘记缩放，或者 `display_width_px` / `display_height_px` 与你发送的图像实际尺寸不匹配，每次点击都会持续偏移。

## **messages 数组中的内容顺序**

在构建 messages 的 content 数组时，将文本指令放在图像_之前_，如下方代码片段所示。这让模型在处理截图时知道要寻找什么，从而提高点击准确率。

```
# RECOMMENDED — text instruction first, then screenshot:
content = [
    {"type": "text", "text": "Click on the Submit button"},
    {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": screenshot_b64}},
]

# NOT RECOMMENDED — image first, then text:
content = [
    {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": screenshot_b64}},
    {"type": "text", "text": "Click on the Submit button"},
]
```

## **诊断点击问题**

如果点击没有命中目标，通常可归结为以下原因之一：

| 症状 | 可能原因 | 尝试此方法 |
| --- | --- | --- |
| 点击持续朝一个方向偏移 |
-   display\_width\_px / display\_height\_px 与发送的实际图像尺寸不匹配
-   截图超过 API 限制并被静默降采样
-   内容顺序是图像在前而非文本在前

 |

-   确保显示尺寸与你调整后的截图完全匹配，而不是你的原生分辨率
-   预先降采样到 1280x720 或使用 compute\_max\_api\_fit
-   将文本指令移到 content 数组中的图像之前

 |
| 点击落在大致正确的区域但未命中目标 |

-   目标非常小（复选框、图标、开关）
-   源图像分辨率非常高（4K+），降采样过程中细节丢失
-   强制使用非原生宽高比导致宽高比失真

 |

-   对密集 UI 启用 enable\_zoom: True
-   以较低 DPI 捕获，或在降采样前裁剪到相关屏幕区域
-   调整尺寸时保持源宽高比

 |
| 模型完全点击了错误的元素 |

-   指令含糊（存在多个类似提交按钮时只说「点击提交」）
-   目标附近有视觉上相似的元素
-   UI 对单条指令来说过于复杂

 |

-   使用更具体的提示词并附带位置上下文（「点击表单右下角的蓝色提交按钮」）
-   将复杂交互拆分为更小的步骤
-   提供关于页面布局的额外上下文

 |
| 整体准确率都很差 |

-   发送的截图超过 API 限制
-   源图像来自极高分辨率显示器（4K+），压缩比极高
-   分辨率太低，丢失了关键细节

 |

-   预先将所有截图降采样到限制之内
-   对于 4.6 系列上的 4K+ 源图像，Sonnet 对重度降采样的鲁棒性强于 Opus 4.6。在 Opus 4.7 上这一差距基本消失，使用 4.7 的像素预算（最高 3.75 MP），从一开始就需要更少的降采样。
-   尝试以 1280x720 作为基线；如果损失太大，使用 compute\_max\_api\_fit

 |

## **点击任务的模型选择**

根据我们的内部测试，Claude Sonnet 4.6 在点击方面往往在机械精度上更高（空间准确率更好、近失更少），而 Claude Opus 4.6 带来更强的推理能力。当源图像需要重度降采样时，Sonnet 4.6 也更鲁棒。

Opus 4.7 缩小了这一差距：通过测试，我们发现其点击精度大致与 Sonnet 4.6 相当，而其更高的分辨率预算从一开始就减少了所需的降采样量，这使它成为你希望将 Opus 级推理与强大点击准确率结合时的有力选择。

对于大多数任务，我们建议从 Sonnet 4.6 开始，它在点击准确率、推理和成本之间提供了最佳平衡。当你需要更强推理时选择 Opus 4.7，尤其是在使用高分辨率源图像时。当延迟是优先考虑时，Haiku 4.5 仍然是一个极佳选择。高级工作流仍可能受益于编排器 + 子智能体模式，即由推理模型负责规划和决策，而由 Sonnet 或 Haiku 执行机械点击步骤。

## **处理小目标**

目标越小，点击准确率越低。大号和中号 UI 元素（按钮、输入框和标准菜单项）在安全区内的所有分辨率下都可靠。挑战在于小号和极小目标，例如复选框、系统托盘图标、下拉箭头、小开关和树视图展开/折叠按钮。

如果你的应用涉及频繁点击小目标，考虑以下策略：

**对密集 UI 使用缩放。** Claude 4.6 和 4.7 模型支持缩放能力，让模型在点击前以更高分辨率检查特定屏幕区域。在你的[工具配置](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)中启用它：

```
{
    "type": "computer_20251124",
    "name": "computer",
    "display_width_px": 1280,
    "display_height_px": 720,
    "enable_zoom": True
}
```

**让目标更大。** 如果你能控制被自动化的 UI，增大点击目标的尺寸（即使幅度不大）也会对可靠性产生不成比例的影响。这可能意味着使用较低的系统 DPI、在浏览器中放大，或调整 UI 缩放设置。

**对极小目标使用键盘替代方案。** 对于非常小的元素，例如系统托盘图标或极小的复选框，键盘快捷键或基于 Tab 的导航可能比点击更可靠。如果你的工作流允许，提示模型在特定步骤使用键盘交互可以提高成功率。

**考虑源图像分辨率。** 来自 4K+ 显示器并被压缩到 720p 的截图会丢失大量细节（例如，3840x2160 原生分辨率下的 16px 复选框在 1280x720 显示分辨率下大约变成 5px，这使目标小得多，因而更难命中）。如果你处理的是极高分辨率显示器，考虑使用 Opus 4.7，它的分辨率限制高于之前的模型。如果使用 4.6 模型，考虑以较低 DPI 捕获、使用显示缩放放大 UI 元素，或将截图聚焦于屏幕的相关部分而非整个显示器。由于这些模型用更少的像素表示更多信息，我们观察到性能会随着源图像尺度增大而下降，这意味着需要更多压缩。

## **我们测试过但没有帮助的方法**

我们在内部评估中试验了几种流行的优化技术，没有发现这些方法带来一致的提升，不过结果可能因具体情况而异：

-   **将图像拆分为更小的图块**：将截图拆分为四个象限或区域并分别发送，没有提高点击准确率。
-   **叠加带坐标的网格图案**：在截图上添加视觉坐标网格以帮助模型定位目标，没有产生可靠的收益。
-   **调整尺寸算法的选择**：PIL LANCZOS、sips 和其他常见调整尺寸算法产生相同的结果。使用对你技术栈方便的任何一种即可。

## **检查失败**

如果在尝试上述修复后模型行为仍不可预测，记录完整对话记录，并将预测的点击叠加到源截图上，以了解模型实际看到和决定的内容。

有些失败与点击准确率完全无关。例如，某些下拉菜单可能调用浏览器视口无法捕获的系统级 UI——模型看起来是任务失败，但实际上它只是看不到需要交互的菜单。在这种情况下，模型应依赖替代方法，例如 JavaScript 执行、键盘导航或直接操作文档对象模型（DOM），而不是点击。

## **快速参考**

_如何为计算机使用缩放和准备图像_

```
import math
from PIL import Image
import base64
import io

# 1568 for 4.6 family, 2576 for Opus 4.7
MAX_LONG_EDGE = 1568

# 1.15MP for 4.6 family, 3.75MP for Opus 4.7
MAX_PIXELS = 1_150_000

def prepare_screenshot(screenshot: Image.Image, native_w: int, native_h: int) -> tuple[str, int, int]:
    """Resize a screenshot to fit API limits and return base64 + display dimensions."""

    # Option A: Fixed 720p (simple, reliable)
    display_w, display_h = 1280, 720

    # Option B: Max API fit (maximizes fidelity)
    # display_w, display_h = compute_max_api_fit(native_w, native_h)

    resized = screenshot.resize((display_w, display_h), Image.LANCZOS)

    buffer = io.BytesIO()
    resized.save(buffer, format="PNG")
    b64 = base64.standard_b64encode(buffer.getvalue()).decode()

    return b64, display_w, display_h

def scale_coordinates(api_x: int, api_y: int, display_w: int, display_h: int,
                      screen_w: int, screen_h: int) -> tuple[int, int]:
    """Scale API-returned coordinates back to native screen space."""
    screen_x = int(api_x * (screen_w / display_w))
    screen_y = int(api_y * (screen_h / display_h))
    return screen_x, screen_y

def compute_max_api_fit(native_w: int, native_h: int) -> tuple[int, int]:
    """Compute the largest resolution that fits API limits while preserving aspect ratio."""
    aspect = native_w / native_h
    h_from_pixels = math.sqrt(MAX_PIXELS / aspect)
    w_from_pixels = h_from_pixels * aspect

    if native_w >= native_h:
        w = min(w_from_pixels, MAX_LONG_EDGE)
        h = w / aspect
    else:
        h = min(h_from_pixels, MAX_LONG_EDGE)
        w = h * aspect

    w = min(w, native_w)
    h = min(h, native_h)
    return int(w), int(h)
```

**用法：**

```
import anthropic
from PIL import Image

client = anthropic.Anthropic()

# Capture screenshot (your method here)
screenshot = Image.open("screenshot.png")
native_w, native_h = screenshot.size

# Prepare for API
b64, display_w, display_h = prepare_screenshot(screenshot, native_w, native_h)

# Send to Claude — text before image
response = client.beta.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    betas=["computer-use-2025-11-24"],
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Click on the Submit button"},
            {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": b64}},
        ]
    }],
    tools=[{
        "type": "computer_20251124",
        "name": "computer",
        "display_width_px": display_w,
        "display_height_px": display_h,
    }],
)

# Scale coordinates back for execution
api_x, api_y = extract_click_coords(response)  # your parsing logic
screen_x, screen_y = scale_coordinates(api_x, api_y, display_w, display_h, native_w, native_h)
```

## **为计算机使用调整思考投入**

Claude 的最新模型支持[自适应思考](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)，这一设置让 Claude 决定在行动前对中间步骤进行多少推理。自适应思考无需手动设置思考 token 预算，而是让 Claude 根据每个请求的复杂度动态决定何时以及使用多少扩展思考。对于计算机使用，这意味着 Claude 可以思考它在屏幕上看到的内容、规划多步交互，并在确定点击或按键之前自我纠正。

在自适应思考下，Claude 的思考深度通过 thinking 参数配合 effort 级别控制：low、medium、high、xhigh（Opus 4.7 支持）和 max。更多思考意味着每个动作更多推理，但也意味着更多输出 token、更高延迟和更高成本。

自然的问题是：取决于模型，多少思考对计算机使用是最优的？

## **Claude Opus 4.7**

我们在涵盖桌面应用、浏览器和多应用工作流的端到端 UI 自动化任务套件中测试了每个思考 effort 级别。



**Opus 4.7 优于 4.6 系列。** 在 OSWorld Verified 基准测试中，我们发现 Opus 4.7 在等效 token 用量和 effort 设置下优于所有 4.6 系列模型。Opus 4.7 在 low effort 下的得分与 Sonnet 4.6 在 max 下相似，而每个任务的 token 用量约为其 1/10。对于困难任务，Opus 4.7 是显而易见的选择。

**将 effort 设为 `high`** 可达到接近最高任务成功率，同时输出 token 约为 `max` 的一半。与 Opus 4.6 相比，low、medium 和 high 使用的 token 量大致相同，同时提高了 OSWorld 上的得分。在我们的内部测试中，Max effort 使用了更多 token 并提供了最佳得分。下表概述了我们对何时使用每个思考 effort 级别的建议。

### **effort 级别建议**

| 场景 | 思考 effort | 原因 |
| --- | --- | --- |
| 大多数用例的默认值 | high | Opus 4.7 最适合困难任务。使用 high 会给模型足够的推理来规划复杂的多步交互，而不会显著增加 token 用量。 |
| 高吞吐 / 成本敏感 | low | 更低的 token 用量，同时提供介于 Opus 4.6 的 high 和 max effort 设置之间的质量。 |
| 简单、定义明确的工作流 / 最快 | 建议尝试 Sonnet 4.6 | 如果低延迟是最高优先级则使用。对于 UI 一致且工作流已知的短小、可预测任务足够。 |
| 复杂的一次性任务 | max | 当任务极具挑战且你需要第一次尝试就做对时使用。 |

## **Claude 4.6 模型**

我们在涵盖桌面应用、浏览器和多应用工作流的端到端 UI 自动化任务套件中测试了每个思考 effort 级别。



有两种模式很突出：

‍**Medium effort 是最佳平衡点。** 将 effort 设为 medium 可达到接近最高任务成功率，同时输出 token 约为 high 的一半。超过 medium 后，性能有些趋于平稳。值得注意的是，当任务被重试时，medium 和 high 会收敛到相同的成功率。这意味着 high effort 可能帮助模型第一次就做对困难任务，但在多次尝试下，medium 可能以更低成本同样可靠地达到目标。

**少量思考大有裨益。** low effort 是一个出人意料地强的选项。它实际上使用的总输出 token 比完全禁用思考_更少_（模型犯错更少，需要更少的重试周期），同时匹配或略超过无思考的准确率。这使它成为成本敏感、高吞吐工作负载的最佳选项。下表概述了我们的 effort 建议。

### **effort 级别建议**

| 场景 | 思考 effort | 原因 |
| --- | --- | --- |
| 大多数用例的默认值 | medium | 最佳准确率成本比。给模型足够的推理来规划多步交互而不过度思考。配合重试，以一半的 token 成本匹配 high 性能。 |
| 高吞吐 / 成本敏感 | low | 比无思考更准确，但由于错误和重试更少，token 用量更低。 |
| 简单、定义明确的工作流 / 最快 | 禁用思考 | 如果低延迟是最高优先级则使用。对于 UI 一致且工作流已知的短小、可预测任务足够。 |
| 复杂的一次性任务 | high | 当任务具有挑战且你需要第一次尝试就做对时使用。如果你的系统支持重试，medium 可能达到相同的最终成功率。 |

我们不建议为计算机使用使用 `max` effort。在我们的测试中，它相比 `high` 没有提供准确率收益，同时进一步增加输出 token 成本。UI 任务主要是感知性的而非深度逻辑性的，额外的推理预算要么未被使用，要么导致过度思考。请记住，这一建议会随着模型演进发生变化。

## **medium effort 级别配置示例**

```
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    betas=["computer-use-2025-11-24"],
    thinking={"type": "adaptive"},
    output_config={"effort": "medium"},
    messages=[...],
    tools=[
        {
            "type": "computer_20251124",
            "name": "computer",
            "display_width_px": 1280,
            "display_height_px": 720,
        }
    ],
)
```

## **为什么更多思考并不总是有帮助**

UI 自动化任务与编码或数学问题有本质不同。大多数计算机使用动作是感知性和机械性的：识别正确的元素、在正确的位置点击，而非深度逻辑性的。思考在模型需要以下情况时帮助最大：

-   在开始前规划多步序列（例如，「我需要打开设置，导航到隐私，然后禁用跟踪」）
-   从意外的 UI 状态中恢复（例如，出现了一个未预料到的对话框）
-   在屏幕上的信息与任务指令之间交叉引用信息
-   在专业软件上完成具有挑战性的项目

## **提升安全性：利用提示词注入分类器**

_本节介绍提示词注入防护，如果你使用我们的官方计算机使用工具请求头，该防护默认免费提供。但是，如果你有兴趣在自定义计算机或浏览器使用工具上启用此功能，请填写我们的_[_提示词注入分类器意向表。_](https://docs.google.com/forms/d/e/1FAIpQLSfXj6rXC-SUQEYHCLabwUe5JuYiYyJ29Ja-KP7EhLIPlyz0tw/viewform?usp=dialog)

计算机使用智能体在设计上就会与不可信内容交互。Claude 处理的每张截图、网页或应用 UI 都可能包含对抗性指令，包括隐藏文本、被操纵的图像、欺骗性 UI 元素，或试图劫持智能体行为的社会工程尝试。这一攻击面与典型的 API 集成有本质不同，后者你控制输入。在计算机使用中，模型的输入是开放的互联网以及智能体正在导航的任何软件。

随着计算机使用智能体变得更有能力并被更广泛地部署，提示词注入相应地成为更严重的风险。一个能够点击、输入和导航的智能体可能被操纵去执行现实世界的动作，例如填写表单、下载文件或导航到恶意 URL。构建针对这些攻击的鲁棒防御对任何生产部署都至关重要。

## **我们如何应对提示词注入防御**

我们已详细撰写了关于浏览器和计算机使用的[提示词注入防御方法](https://www.anthropic.com/research/prompt-injection-defenses)。我们的防御策略在多个层面运作：

**训练时鲁棒性。** 我们使用强化学习将提示词注入抵抗力直接构建到 Claude 的能力中。在训练期间，Claude 会接触到嵌入在模拟网页和应用 UI 中的注入内容，并在正确识别和拒绝遵循恶意指令时获得奖励。这意味着 Claude 的第一道防线是模型本身，因为它已学会区分合法用户指令和任务执行期间遇到的对抗性内容。

**实时分类器。** 我们运行探针，扫描进入 Claude 上下文窗口的内容并标记潜在的提示词注入尝试。这些探针跨多种模态检测对抗性命令，例如隐藏在页面内容中的文本、嵌入图像中的指令，以及旨在欺骗智能体的欺骗性 UI 元素，并在识别到攻击时调整 Claude 的行为。

**持续红队。** 我们的安全研究人员持续探测这些防御，我们参与外部对抗性评估，以基准测试针对不断演变的攻击技术的鲁棒性。

自最初的计算机使用研究预览以来，我们持续在全部三个层面上大量投入。每一代新模型都包含更强的训练时防御和更有能力的分类器，我们也扩展了红队评估所针对的攻击技术范围。

## **使用 Claude 内置分类器**

当你通过 API 使用 Claude 的[官方计算机使用工具](https://docs.anthropic.com/en/docs/agents-and-tools/computer-use)时，提示词注入分类器会在每个请求上自动运行。这些分类器与主模型推理并行运行，为你的请求增加约零额外延迟和零额外成本。

你无需配置任何内容来启用此防护。当你使用官方 `computer_20251124` 工具类型时，它默认开启。分类器评估截图和其他内容是否存在提示词注入迹象，并相应地影响 Claude 的响应。

```
# Classifiers run automatically when using the official CU tool — no extra config needed
tools = [
    {
        "type": "computer_20251124",
        "name": "computer",
        "display_width_px": 1280,
        "display_height_px": 720,
    }
]
```

## **如果你未使用官方计算机使用工具**

许多开发者使用自定义工具定义而非官方 `computer_20251124` 工具类型来构建计算机使用集成，例如定义自己的截图和点击工具。如果这描述了你的设置，上述内置分类器目前不会在你的请求上运行。

我们正在积极探索如何将提示词注入防护扩展到这些自定义实现。如果你正在构建不使用官方工具类型的计算机使用或浏览器使用集成，并且对提示词注入分类器感兴趣，[填写此意向表](https://docs.google.com/forms/d/e/1FAIpQLSfXj6rXC-SUQEYHCLabwUe5JuYiYyJ29Ja-KP7EhLIPlyz0tw/viewform?usp=dialog)，我们会在该能力可用时跟进。

## **无论是否使用分类器的最佳实践**

分类器是一层防御，而非完整解决方案。我们建议任何计算机使用部署都采用以下实践：

**对高风险动作实施人在回路。** 让智能体在执行不可逆动作（例如提交表单、进行购买、发送消息或修改数据）之前暂停并请求用户确认。无论分类器性能如何，这是针对提示词注入最有效的单项缓解措施。

**限定智能体的权限。** 限制智能体能做的事情。如果你的工作流不需要文件下载，就不要给智能体下载文件的权限。如果它不需要发送电子邮件，就不要给它电子邮件客户端的权限。减少成功注入的影响范围与防止注入本身同样重要。

**监控并记录智能体动作。** 记录智能体执行的完整动作序列，包括每一步的截图。这让你能够检测异常行为、在出错时审计发生了什么，并构建反馈循环以随时间提高系统的鲁棒性。

**将所有 Web 内容视为不可信。** 设计智能体的系统提示词，清晰区分用户指令和任务执行期间遇到的内容。提醒模型，网页、电子邮件或应用 UI 中找到的文本不是来自用户，不应被视为指令。

## **计算机使用的上下文管理**

在构建计算机使用智能体时，截图会快速累积。每个动作都会生成一张新图像，每张图像根据分辨率消耗大约 1,000–1,800 个 token。在计入系统提示词、工具定义和文本内容后，一个 200k 上下文窗口在远不到 100 张截图时就会填满。

良好地管理这一上下文有两个目标：1）保持总 token 有界，2）保持提示词缓存有效，这样你不会反复为相同前缀支付全价。我们发现有效的[上下文管理](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)对长时间运行智能体的成本和延迟的影响几乎超过任何其他优化。本节涵盖三个可以干净组合的层面：放置缓存断点、在不破坏缓存的情况下修剪旧截图，以及在修剪不够时总结历史。

## **放置缓存断点**

提示词缓存只有在断点落在跨轮次重复出现的内容上时才有帮助。API 总共支持四个缓存断点。将全部四个放在稳定前缀（系统提示词、工具定义）上是浪费，因为该前缀只命中一次且从不失效，所以一个断点就足够。另外三个最好用在最近的历史上，那里失效风险最高，且节省会在长会话中累积。

我们建议：

-   **一个断点放在系统提示词或末尾工具定义上。** 该前缀在会话内很少变化。
-   **最多三个额外断点放在最近的工具结果上**，每轮推进并清除上一迭代的断点，以免超过四断点限制。

将断点分散在最近位置上可带来优雅降级。如果你最近的断点失效了，例如因图像修剪、上下文压缩（compaction）或工具定义更改，较早的断点仍可命中，你继续支付完整输入成本的 10% 而非 100%。

_缓存控制和设置断点的示例：_

```
def set_trailing_cache_control(messages, max_breakpoints=3):
    """Place up to `max_breakpoints` ephemeral cache_control markers on the
    most recent tool_result blocks, after clearing any existing markers."""
    for msg in messages:
        for block in msg.get("content", []):
            if isinstance(block, dict):
                block.pop("cache_control", None)

    placed = 0
    for msg in reversed(messages):
        for block in reversed(msg.get("content", [])):
            if placed >= max_breakpoints:
                return
            if isinstance(block, dict) and block.get("type") == "tool_result":
                block["cache_control"] = {"type": "ephemeral"}
                placed += 1
```

## **方法 1：滚动缓冲区（缓存感知）**

保持 token 计数有界的最简单方法是只保留最近 N 张截图，丢弃其余。在每次 API 调用之前，遍历 messages 数组，将较旧的图像块替换为简短占位符（例如，一个写着「\[Image omitted\]」的文本块）。

这种模式的朴素版本是随着截图老化逐张丢弃，这会每轮改变前缀并持续使提示词缓存失效。这就是滚动缓冲区因破坏缓存而声名不佳的原因。修复方法是批量修剪，使前缀在若干轮内保持字节完全相同，然后失效一次，然后再次保持稳定。

我们测试过的一个具体模式是：

1.  以完整分辨率保留最近的 keep\_n 张截图。
2.  一旦截图总数超过 keep\_n + interval，在一次遍历中将最旧的 interval 张截图替换为占位符。
3.  在修剪事件之间，messages 数组跨轮次字节完全相同，因此你的缓存断点持续命中。

合理的起始默认值：keep\_n = 3，interval = 25。这些可调，更高的 interval 意味着更少的修剪事件（更好的缓存效率），但上下文中保留更多全分辨率截图的尾部（更多 token）。在代表性轨迹上测量缓存命中率和总输入 token，并据此调整。

_在保留缓存断点的同时修剪旧截图的示例：_

```
def prune_old_screenshots(messages, keep_n=3, interval=25):
    """Replace older screenshots with text placeholders in batches.
    Only prunes when the total count exceeds keep_n + interval, so the
    message prefix stays byte-stable for `interval` turns between prunes."""
    image_positions = [
        (msg_idx, block_idx)
        for msg_idx, msg in enumerate(messages)
        for block_idx, block in enumerate(msg.get("content", []))
        if isinstance(block, dict) and block.get("type") == "image"
    ]
    if len(image_positions) <= keep_n + interval:
        return messages

    to_prune = image_positions[:-keep_n][-interval:]
    for msg_idx, block_idx in to_prune:
        messages[msg_idx]["content"][block_idx] = {
            "type": "text",
            "text": "[Image omitted]",
        }
    return messages
```

滚动缓冲区仍有一个真正的局限：缓冲区之外的任何内容都消失了。原始指令、智能体已经尝试过的内容，以及它在任务中的位置，都会随被修剪的截图一起消失。对于短任务（约 50 个动作以下），这没问题。对于更长的任务，将此与上下文压缩（compaction）结合使用。

## **方法 2：基于 LLM 的上下文压缩（compaction）**

与其静默丢弃旧图像，不如在丢弃之前总结整个对话。摘要保留发生了什么、用户要求了什么、已完成什么，以及从哪里继续。同时保留几张最近的截图，以便智能体看到它当前正在看的内容。

上下文压缩（compaction）和缓存感知滚动缓冲区是互补的。逐轮使用滚动缓冲区以保持 token 增长可控；偶尔使用上下文压缩（compaction）以回收窗口的其余部分而不丢失早期上下文。每次上下文压缩（compaction）事件在设计上都是一次缓存失效，因此你希望它很少发生，而不是每隔几轮就发生。

### **总结提示词**

这个示例提示词提供了一个脚手架，其中每一节针对特定的失败模式。提示词必须捕获智能体继续任务所需的一切，而无需重读原始对话，如下方示例所示：

```
COMPACT_PROMPT = """Your task is to create a detailed summary of this conversation that
will REPLACE the conversation history. The agent will continue working with only this
summary and a few recent screenshots as context.

CRITICAL: Preserve ALL user instructions verbatim. User instructions are the most
critical element. If they are lost, the agent will deviate from the task.

Before providing your summary, analyze the conversation in  tags:
1. Extract every user instruction, requirement, and constraint
2. Identify if this is a repeatable workflow (e.g., processing N items)
3. Chronologically trace what actions were taken and what happened

Your summary MUST include these sections:

1. USER INSTRUCTIONS:
   - Complete initial task definition (verbatim when possible)
   - ALL specific requirements and criteria
   - Every "DO NOT", "ALWAYS", "MUST" instruction
   - Any corrections or feedback that changed the approach

2. TASK TEMPLATE (if this is a repeatable workflow):
   - The pattern being repeated
   - Decision criteria for each iteration
   - Standard workflow steps
   - Example of one completed iteration

3. CONSTRAINTS AND RULES:
   - All user-specified rules and restrictions
   - Edge cases and exceptions discovered

4. ACTIONS TAKEN:
   - Pages visited and elements interacted with
   - Forms filled and buttons clicked

5. ERRORS AND FIXES:
   - What went wrong and how it was resolved
   - Approaches that failed (so they aren't retried)

6. PROGRESS TRACKING:
   - Items completed vs. remaining
   - Current position in the workflow

7. CURRENT STATE:
   - Current application, URL and domain (optional)
   - Important page state (logged in, form progress, etc.)

8. NEXT STEP:
   - Exactly what should be done next to continue
"""
```

在上述提示词中，**User Instructions** 防止任务漂移：没有它们，智能体在上下文压缩（compaction）后会偏离。**Task Template** 捕获可重复的模式，使智能体在上下文压缩（compaction）后可以继续迭代，而无需从头重新推导工作流。**Constraints and Rules** 保留任务前设定或任务期间发现的限制和边缘情况，使智能体不会违反它本应遵守的现有规则。**Actions Taken** 帮助跟踪过去的进度。**Errors and Fixes** 防止重试失败的方法（「我已经尝试点击提交；在勾选条款复选框之前它不起作用」）。**Progress Tracking** 防止重新开始和跳过项目。**Current State** 和 **Next Step** 给出明确的恢复入口点。

### **服务端上下文压缩（compaction）（beta）**

使用此提示词的最简单方法是让 API 通过[服务端上下文压缩（compaction）](https://docs.anthropic.com/en/docs/build-with-claude/compaction)（beta）处理上下文压缩（compaction）。将你的自定义总结提示词作为 `context_management` 中的 `instructions` 参数传入，当输入 token 超过触发阈值时 API 会自动总结。`instructions` 参数完全替换默认总结提示词，因此上述各节就是模型将遵循的内容。设置 `pause_after_compaction` 以在上下文压缩（compaction）事件之间保留最近的消息（包括截图）。

_使用自动上下文压缩（autocompaction）工具的示例：_

```
# Minimal — turn on autocompaction with API defaults
response = client.beta.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    betas=["compact-2026-01-12", "computer-use-2025-11-24"],
    context_management={"edits": [{"type": "compact_20260112"}]},
    messages=[...],
    tools=[...],
)

# Customized — set your own trigger threshold and summarization prompt
response = client.beta.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    betas=["compact-2026-01-12", "computer-use-2025-11-24"],
    context_management={
        "edits": [
            {
                "type": "compact_20260112",
                "trigger": {"type": "input_tokens", "value": 150_000},
                "instructions": COMPACT_PROMPT,
            }
        ]
    },
    messages=[...],
    tools=[...],
)
```

### **在客户端截断以匹配服务端**

当 API 运行服务端上下文压缩（compaction）时，它会在自己一侧替换压缩前的内容，但你本地的 messages 数组仍持有完整历史。如果你在后续每轮继续发送完整历史，你会为服务端不再需要的 token 付费，而且你的滚动缓冲区修剪器将操作与服务端实际看到的不同的消息切片，这可能破坏你上面精心维护的缓存稳定前缀。

修复方法是在客户端镜像服务端的截断，如下方代码片段所示。当响应报告发生了上下文压缩（compaction）时，在下一轮之前从本地 messages 数组中丢弃上下文压缩（compaction）标记之前的所有内容。这保持客户端和服务端视图对齐，并让滚动缓冲区继续正确工作。

```
def truncate_to_last_compaction(messages, response):
    """If the server compacted on this turn, drop pre-compaction messages
    locally so the next turn's cache prefix matches what the server sees."""
    context_mgmt = getattr(response, "context_management", None)
    if not context_mgmt or not context_mgmt.get("applied_edits"):
        return messages

    compaction = next(
        (e for e in context_mgmt["applied_edits"] if e["type"] == "compact"),
        None,
    )
    if compaction is None:
        return messages

    keep_from = compaction["message_index_after_compaction"]
    return messages[keep_from:]
```

## **客户端上下文压缩（compaction）**

如果你使用的模型不支持服务端上下文压缩（compaction），或者你想要完全控制，可以在客户端使用相同的提示词实现上下文压缩（compaction）。在每次 API 调用后，检查响应 usage 字段中的总输入 token 计数。当它超过阈值（例如上下文窗口的 90%）时，将对话发送给总结模型，以 COMPACT\_PROMPT 作为系统提示词。用摘要加上几张最近的截图替换消息历史，然后继续智能体循环。

## **整合起来**

一个长时间运行的计算机使用智能体的良好默认配置如下：

-   一个缓存断点在稳定前缀上，三个在末尾工具结果上，每轮清除并重新放置。
-   缓存感知滚动缓冲区，keep\_n = 3 和 interval = 25，批量将较旧的截图替换为占位符。
-   服务端上下文压缩（compaction）在约 150k 输入 token 时触发，使用自定义提示词，加上客户端截断遍历以保持两个视图对齐。

有了这三个层面，典型的长时间跨度计算机使用会话将在绝大多数轮次命中提示词缓存，保持总输入 token 远低于上下文窗口，并通过上下文压缩（compaction）事件保留足够的历史，使智能体不会失去任务线索。

## **改进计算机与浏览器使用的实验性设置**

以下模式是我们在实现中一直在测试的技术，它们显示出前景但尚未成为全面建议。每一种都以复杂性或成本换取特定类型工作负载上的潜在提升。我们在此包含它们，以便你在自己的工作流上尝试，但请预期本节的指导会快速演变。

## **批量工具**

在更新的参考实现中，我们在标准计算机和浏览器工具之外暴露了两个工具：`computer_batch` 和 `browser_batch`。每个接受一个子动作列表，并在单次工具调用中执行它们。例如，模型可以发出一个包含全部三个动作的 computer\_batch 调用，而不是分开的点击、输入和按键轮次。

吸引力在于效率：一个有 N 个机械动作的工作流是单次往返而非 N 次往返，这在长时间跨度任务上显著减少实际耗时和输出 token 支出。风险是复合错误，如果动作 2 依赖于动作 1 改变的视觉状态，而动作 1 未命中，批次的其余部分就在过时的假设上运作，智能体可能在从未看到实际状态截图的情况下漂移。

我们建议在子动作自包含且不依赖彼此视觉结果时使用批量工具（填写表单中的多个字段、串联键盘快捷键、滚动并点击已知目标）。我们会在探索性导航、错误恢复序列，或任何「如果动作 1 失败我需要重新规划」是真实状态的工作流中避免使用它们。

因为批量工具是你自己的自定义定义，它们与标准计算机或浏览器工具干净地叠加。保持两者可用，让模型选择。

## **advisor 工具（beta）**

[advisor 工具](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)将执行器模型与一个更高智能的 advisor 模型配对，执行器可以在生成过程中咨询它以获得战略指导。执行器运行循环，当遇到需要更深推理的内容时，它调用 advisor，接收计划或路线纠正，然后继续。这在单个请求内于服务端发生，你这边没有额外往返。

具体到计算机使用，这种模式在长时间跨度任务上最有用，其中大多数轮次是机械点击，但偶尔的规划时刻（选择打开哪个标签页、从意外的模态框恢复、决定是否放弃某个策略）受益于 Opus 级推理。你获得接近 advisor 单独工作的质量，而大部分 token 生成以执行器的费率发生。

_启用 advisor 工具的示例：_

```
response = client.beta.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    betas=["advisor-tool-2026-03-01", "computer-use-2025-11-24"],
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-7",
        },
        {
            "type": "computer_20251124",
            "name": "computer",
            "display_width_px": 1280,
            "display_height_px": 720,
        },
    ],
    messages=[...],
)
```

advisor 工具的有用控制包括：

-   **`max_uses`：** 限制每个请求的 advisor 调用次数。当你想要限制最坏情况成本时很有帮助。
-   **你的执行框架中的会话级上限：** advisor 每次咨询按 Opus 4.7 费率计费，因此在非常长的会话中，你可能希望在若干次使用后停止提供 advisor。
-   **advisor 侧缓存：** 在多调用对话中，缓存 advisor 的前缀在大约三次咨询后就能收回成本。在参考实现中，我们默认使用 5 分钟临时缓存。

两件不那么显而易见但值得知道的事：advisor 在没有工具和没有上下文管理的情况下运行，因此它不能代表你点击或浏览，它只返回文本建议。而且由于执行器模型在长时间跨度任务上并不总是记得 advisor 的存在，请参阅下面的提醒提示部分。

## **清理孤立的 advisor 块**

当 advisor 工具触发时，执行器在返回的 content 中发出一个 name 为 "advisor" 的 `server_tool_use` 块，随后是一个 `advisor_tool_result` 块。这些块与其他内容一起存在于你的 messages 数组中。

如果你后来从 tools 数组中移除 advisor 工具——因为你达到了会话级上限、更改了配置或切换了模型——那些先前的 `server_tool_use` / `advisor_tool_result` 块就变成孤立的。API 会在下一个请求上返回 400，因为引用的工具不再声明。

修复方法是一个简单的发送前遍历：每当某一轮禁用 advisor 时，遍历消息历史并剥离任何类型为 `server_tool_use`（name == "advisor"）和 `advisor_tool_result` 的内容块。

_移除过期 advisor 块的示例：_

```
def strip_orphaned_advisor_blocks(messages):
    """Remove advisor server_tool_use / tool_result blocks from history.
    Call this before any request that doesn't include the advisor tool."""
    for msg in messages:
        content = msg.get("content")
        if not isinstance(content, list):
            continue
        msg["content"] = [
            block for block in content
            if not (
                isinstance(block, dict)
                and (
                    (block.get("type") == "server_tool_use"
                     and block.get("name") == "advisor")
                    or block.get("type") == "advisor_tool_result"
                )
            )
        ]
    return messages
```

## **周期性提醒提示**

在长会话中，执行器模型可能忘记哪些工具可用或它应该偏好哪些工具。两种简短的提醒模式在我们的测试中有帮助：

**批量提醒。** 如果你在标准工具之外暴露 `computer_batch` 或 `browser_batch`，并观察到模型在批量合适时串联单动作调用，在下一个工具结果之后附加一条简短的系统级提示：「记住你可以使用 `computer_batch` 在单次工具调用中组合顺序动作，当它们不依赖中间截图时。」目标是引导模型回到批处理，而不规定确切何时。

**advisor 提醒。** advisor 工具很容易被执行器忘记存在，尤其是如果它已经很多轮未被调用。在超过约 20 轮没有 advisor 调用的会话中，附加一条简短提醒，说明 advisor 可用于规划或路线纠正时刻。在参考实现中，我们使用 20 轮的节奏并附加一行提示。

两种提示都是轻触式上下文注入，而非系统提示词重写。每次附加花费几十个输入 token。如果你的系统提示词已经很长，或者你的缓存断点放置得很精确，权衡提升是否值得增加的失效风险。

## **参考实现中的调试模式**

当某些东西行为异常，而你不确定问题是你的执行框架、你的截图还是模型时，在开始添加日志之前，参考实现中的三个辅助工具值得一试：

-   **轨迹查看器（streamlit run viewer/app.py）。** 加载录制的轨迹，让你逐步查看智能体的轮次，包括截图、思考、工具调用和每步用量。最适合在失败运行后回答「模型实际看到了什么，它决定了什么？」
-   **工具调试面板（uvicorn debug.server:app --reload）**。一个小型 Web UI，让你单独测试每个工具：截图、捕获点击坐标、输入、滚动、缩放。用于确认你的捕获流水线和坐标缩放确实产生了你预期的结果。
-   **定位游乐场（uvicorn localize.server:app --reload --port 8001）**。上传任何图像并要求模型指向目标。在显示分辨率和原生分辨率下将预测坐标渲染回你的图像上。这是诊断点击未命中是调整尺寸 bug、坐标缩放 bug 还是真正的模型错误的最快方法。当客户报告点击不良而你想隔离复现失败时，这尤其有用。

这些都不是构建可用集成所必需的；它们是调试辅助工具，用于默认反馈循环（记录、重跑、眯眼看对话记录）不够快的时候。

## **提高可靠性：教 Claude**

与其反复迭代文本提示词直到 Claude 把工作流做对，你可以直接向它展示正确行为。录制自己执行任务的过程，捕获每一步的截图、动作和可选的语音叙述，然后在 Claude 执行相同工作流时将该演示作为上下文回放。录制内容成为 Claude 可以遵循的可复用规范，适应实时 UI 状态的差异。

我们在 Claude in Chrome 内部使用这种模式（我们称之为「Teach Mode」），并在此分享，因为底层方法对任何构建计算机使用或浏览器使用产品的人都广泛有用。它有两方面帮助：提高 Claude 大多能处理但偶尔出错的工作流的可靠性，以及解锁 Claude 仅凭文本提示词无法完成的全新工作流。核心思想（捕获演示，将其作为上下文反馈）实现起来很直接，并且很好地适应浏览器和桌面环境。

### **核心概念：展示，而非讲述**

传统的提示词工程要求用户用文字描述他们想要什么，然后在 AI 误解时迭代。这种模式将其反转：用户演示任务，而系统记录他们的动作、截图和（可选的）语音叙述。在回放期间，Claude 接收完整演示作为上下文，并遵循相同的步骤序列，适应当前 UI 状态的任何差异。

关键洞察是回放不是严格重放。Claude 将演示作为指南，同时对实时环境进行推理。如果按钮移动了或菜单重新组织了，Claude 可以在当前 UI 中找到等效元素，而不是盲目点击录制的坐标。

### **数据模型**

基本单元是「工作流步骤」，即录制期间捕获的单个动作。每一步捆绑了做了什么、在哪里发生，以及屏幕看起来什么样：

```
from dataclasses import dataclass, field
from typing import Literal, Optional

@dataclass
class WorkflowStep:
    action: Literal["click", "type", "navigate", "scroll", "select"]
    description: str                         # Human-readable, e.g. "Click the Submit button"
    timestamp: float
    selector: Optional[str] = None           # CSS selector or XPath
    coordinates: Optional[dict] = None       # {"x": int, "y": int}
    url: Optional[str] = None
    screenshot: Optional[str] = None         # Base64-encoded screenshot
    viewport_dimensions: Optional[dict] = None  # {"width": int, "height": int}
    speech_transcript: Optional[str] = None  # Voice narration, if captured
    value: Optional[str] = None              # For type actions

@dataclass
class SavedWorkflow:
    id: str
    name: str                                # e.g. "Submit expense report"
    steps: list[WorkflowStep] = field(default_factory=list)
    description: Optional[str] = None        # AI-generated summary of the workflow
    start_url: Optional[str] = None
    created_at: float = 0.0
    usage_count: int = 0
```

同时捕获选择器和坐标是有意为之：选择器对布局变化更鲁棒，但坐标提供了 Claude 在选择器失效时可以使用的视觉后备。存储视口尺寸，以便在回放环境与录制环境不同时缩放坐标。

### **录制：捕获什么**

至少捕获点击事件、键盘输入、导航变化，以及每个动作的截图。对于每次点击，生成人类可读的描述（来自 aria-labels、文本内容，或通过快速 Claude 调用），并在截图上用视觉标记标注点击位置：

```
def on_click(event):
    step = WorkflowStep(
        action="click",
        selector=generate_selector(event.target),
        coordinates={"x": event.client_x, "y": event.client_y},
        url=current_url(),
        description=generate_description(event.target),
        timestamp=now(),
        viewport_dimensions=get_viewport_size(),
    )
    # Annotate screenshot with a circle at the click position
    screenshot = capture_screenshot()
    step.screenshot = annotate_with_circle(screenshot, event.client_x, event.client_y)
    workflow_steps.append(step)
```

标注（点击位置的彩色圆圈）有两个目的：它帮助用户验证录制捕获了正确的元素，并在回放期间向 Claude 准确显示动作发生的位置。你的回放提示词应澄清这些标记是录制产物，不是实时 UI 的一部分。

### **回放：构建提示词**

这是最重要的部分。当用户触发已保存的工作流时，你构建一条发给 Claude 的消息，包含三样东西：用户的意图、解释演示格式的上下文块，以及录制的截图。

上下文块告诉 Claude 如何解释带标注的截图，以及当实时 UI 不同时如何适应：

```
def generate_playback_context(steps: list[WorkflowStep]) -> str:
    steps_description = "\n".join(
        f"Step {i+1}: {step.description}"
        for i, step in enumerate(steps)
    )

    return f"""<demonstration_context>
The user has recorded a demonstration showing how to perform this task.

RECORDED STEPS:
{steps_description}

ABOUT THE SCREENSHOTS:
- Each screenshot shows the screen state when an action was taken
- BLUE CIRCLES mark where the user clicked — these are recording annotations
- The blue highlighting is NOT part of the actual interface
- Your own screenshots will NOT have these markers

HOW TO USE THIS DEMONSTRATION:
1. Review all steps and screenshots to understand the complete workflow
2. Take your own screenshot to see the CURRENT page state
3. The blue highlights show which element to interact with — find it in your current view
4. Follow the same sequence of actions, adapting to any differences
5. If the UI has changed significantly, use judgment to find equivalent elements
</demonstration_context>"""
```

然后组装完整消息，包含用户的提示词、上下文块，以及每一步的截图作为图像：

```
import anthropic

client = anthropic.Anthropic()

content = [
    {"type": "text", "text": user_prompt},
    {"type": "text", "text": generate_playback_context(workflow.steps)},
]

for i, step in enumerate(workflow.steps):
    if step.screenshot:
        content.append({"type": "text", "text": f"[Step {i+1}: {step.description}]"})
        content.append({
            "type": "image",
            "source": {"type": "base64", "media_type": "image/jpeg", "data": step.screenshot},
        })

response = client.beta.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    betas=["computer-use-2025-11-24"],
    messages=[{"role": "user", "content": content}],
    tools=[{
        "type": "computer_20251124",
        "name": "computer",
        "display_width_px": 1280,
        "display_height_px": 720,
    }],
)
```

### **回放模式**

并非每个工作流都需要对录制演示有相同程度的遵循。有些工作流太长，消耗大量输入 token，最终降低延迟并增加成本。考虑支持一个严格度参数，包含在上下文提示词中：

**严格：** 完全遵循步骤；如果 UI 变化太大则停止并报告。适用于精确序列很重要的合规敏感工作流。

**自适应：** 将演示作为指南但适应 UI 变化。这是大多数用例的最佳默认值——它优雅地处理轻微的布局变化、更新的按钮标签和重新组织的菜单。

‍**目标导向：** 关注最终结果；将录制的步骤视为提示而非指令。当 UI 频繁变化但目标保持不变时有用。使用模型总结录制的演示，使用与下一节所述类似的策略，然后将该摘要传递给计算机使用（CU）模型。

### **示例：端到端费用报告工作流**

以下是已保存工作流在实践中的样子。该工作流捕获五个步骤：导航到费用表单、选择费用类型、从下拉菜单中选择「Travel」、输入金额，以及点击提交。

```
expense_workflow = SavedWorkflow(
    id="wf_abc123",
    name="Submit Expense Report",
    start_url="https://expenses.company.com/new",
    steps=[
        WorkflowStep(
            action="navigate",
            url="https://expenses.company.com/new",
            description="Navigate to new expense form",
            timestamp=1700000000,
        ),
        WorkflowStep(
            action="click",
            selector="#expense-type-dropdown",
            coordinates={"x": 400, "y": 200},
            description="Click on expense type dropdown",
            timestamp=1700000001,
        ),
        WorkflowStep(
            action="click",
            selector="[data-value='travel']",
            coordinates={"x": 400, "y": 280},
            description='Select "Travel" expense type',
            timestamp=1700000002,
        ),
        WorkflowStep(
            action="type",
            selector="#amount-input",
            value="150.00",
            description="Enter expense amount",
            timestamp=1700000003,
        ),
        WorkflowStep(
            action="click",
            selector="#submit-expense-btn",
            coordinates={"x": 1150, "y": 420},
            description="Click the Submit button",
            speech_transcript="Now I'll click submit to send the report for approval",
            timestamp=1700000004,
        ),
    ],
)
```

当用户后来输入「为团队午餐提交我的费用报告（$85.50）」时，回放服务构建一个提示词，包含演示上下文、全部五张带标注的截图，以及新请求中的具体值。Claude 准确看到在哪里点击、遵循什么序列，并调整金额和描述以匹配当前任务。如果你的工作流太长，由于输入 token 计数使这种方法不实用，那么考虑先压缩工作流，然后再将其用作示例。有关管理上下文的提示，请参阅下一节。

## **开始使用计算机与浏览器使用**

这些实践反映了我们目前对什么使计算机使用集成在生产中可靠的最佳理解。它们适用于 Claude 4.6 模型系列和 Opus 4.7，并将随着新模型和新技术的出现而更新。

随着你的集成成熟，最重要的模式将取决于你的具体环境、目标应用和可靠性要求。_‍_

_从[计算机使用文档](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)开始，查看我们这些最佳实践的新[演示实现](https://github.com/anthropics/claude-quickstarts/tree/main/computer-use-best-practices)，或重温[最初的计算机使用研究文章](https://www.anthropic.com/news/developing-computer-use)以了解这些能力是如何构建的以及它们的发展方向。_

_致谢：本文及相应演示由 Lucas Gonzalez 和 Luca Weihs 撰写。作者感谢 Molly Vorwerck、Javier Rando、Maya Nielan、Gabe Mulley 和 Brigit Brown 的贡献。_
